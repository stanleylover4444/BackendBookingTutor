import { Request, Response, NextFunction } from "express";
import { RequestOpen } from "../models/requestOpenModel";
import mongoose, { Types } from "mongoose";
import { sendNotification } from "../kafka/kafkaProducer";


export const getRequestOpen = async (req: Request, res: Response) => {
  try {
    const filter: any = req.query.filter || {};
    const query: any = {};

    if (filter.where) {
      const { status, createdBy, _id } = filter.where;

      if (status) query.status = status;
      if (createdBy) query.createdBy = createdBy;
      if (_id) query._id = new mongoose.Types.ObjectId(_id); 
    }

    const includes: string[] = Array.isArray(filter.include)
      ? filter.include
      : typeof filter.include === 'string'
        ? filter.include.split(',').map((item: string) => item.trim())
        : [];

    let queryChain = RequestOpen.find(query);

    if (includes.includes('createdBy')) {
      queryChain = queryChain.populate('createdBy', 'id fullName');
    }
    if (includes.includes('tutorRequests')) {
      queryChain = queryChain.populate('tutorRequests', 'id fullName');
    }
    if (includes.includes('acceptedTutor')) {
      queryChain = queryChain.populate('acceptedTutor', 'id fullName');
    }

    const result = await queryChain.exec();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: 'Có lỗi xảy ra',
      error: error.message,
    });
  }
};

export const createRequestOpen = async (req: Request, res: Response) => {
  try {
    const {
      subjects,
      educationLevel,
      specificLocation,
      pricePerSession,
      jobDescription,
      sessionsPerWeek,
      createdBy,
      ...extraFields
    } = req.body;

    const requiredFields = [
      "subjects",
      "educationLevel",
      "specificLocation",
      "pricePerSession",
      "jobDescription",
      "sessionsPerWeek",
      "createdBy",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Vui lòng cung cấp đầy đủ thông tin bắt buộc: ${missingFields.join(
          ", "
        )}`,
      });
    }

    const createdByObjectId = mongoose.Types.ObjectId.isValid(createdBy)
      ? new mongoose.Types.ObjectId(createdBy)
      : null;

    if (!createdByObjectId) {
      res.status(400).json({
        message: "createdBy không hợp lệ, phải là ObjectId",
      });
    }
    const newRequestOpen = new RequestOpen({
      subject: subjects,
      grade: educationLevel,
      location: specificLocation,
      price: Number(pricePerSession),
      requirements: jobDescription,
      sessionsPerWeek: Number(sessionsPerWeek),
      createdBy: createdByObjectId,
      status: "waiting",
      tutorRequests: [],
      ...extraFields,
    });

    const savedRequest = await newRequestOpen.save();
    res.status(201).json(savedRequest);
  } catch (error: any) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      error: error.message,
    });
  }
};


export const updateRequestOpen = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { tutorRequests, removeTutor, ...otherFields } = req.body;

    const request = await RequestOpen.findById(id);
    if (!request) {
      res.status(404).json({ message: "Không tìm thấy request open" });
      return;
    }

    let updated = false;

    if (typeof tutorRequests === "string") {
      const tutorObjectId = new mongoose.Types.ObjectId(tutorRequests);
      const exists = request.tutorRequests.some(
        (t: any) => t.toString() === tutorRequests
      );
      
      const receiverId = request.createdBy.toString();
      
      await sendNotification({
        receiverId: receiverId,
        title: "Gia Sư Thành Danh",
        body: "Bạn có thông báo mới",
        data: { key: "value" },
      });
      
      if (!exists) {
        request.tutorRequests.push(tutorObjectId);
        updated = true;
      }
    }

    if (typeof removeTutor === "string") {
      const before = request.tutorRequests.length;
      request.tutorRequests = request.tutorRequests.filter(
        (t: any) => t.toString() !== removeTutor
      );
      if (request.tutorRequests.length < before) updated = true;
    }

    for (const [key, value] of Object.entries(otherFields)) {
      if (value !== undefined) {
        (request as any)[key] = value;
        updated = true;
      }
    }

    if (updated) {
      request.updatedAt = new Date();
      await request.save();
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const deleteRequestOpen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedRequest = await RequestOpen.findByIdAndDelete(id);
    if (!deletedRequest) {
      res.status(404).json({
        message: `Không tìm thấy request open với id: ${id}`,
      });
    }

    res.status(200).json({
      message: "Xóa request open thành công",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi xóa",
      error: error.message,
    });
  }
};
