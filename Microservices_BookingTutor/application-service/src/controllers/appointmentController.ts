import { Request, Response, NextFunction } from "express";
import { Appointment } from "../models/appointmentModel";
import mongoose, { Types } from "mongoose";
import { sendAppointmentCreated } from "../kafka/kafkaProducer";
import { User } from "../models/userModel";
import { Customer } from "../models/customerModel";

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const filter: any = req.query.filter || {};
    const query: any = {};

    if (filter.where) {
      const { status, tutorId, studentId, _id } = filter.where;

      if (status) query.status = status;
      if (tutorId) query.tutorId = tutorId;
      if (studentId) query.studentId = studentId;
      if (_id) query._id = new mongoose.Types.ObjectId(_id);
    }

    const includes: string[] = Array.isArray(filter.include)
      ? filter.include
      : typeof filter.include === "string"
      ? filter.include.split(",").map((item: string) => item.trim())
      : [];

    let queryChain = Appointment.find(query);

    if (includes.includes("tutorId")) {
      queryChain = queryChain.populate("tutorId", "id fullName");
    }
    if (includes.includes("studentId")) {
      queryChain = queryChain.populate("studentId", "id fullName");
    }

    const result = await queryChain.exec();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: "Có lỗi xảy ra",
      error: error.message,
    });
  }
};


export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      tutorId,
      studentId,
      subject,
      price,
      grade,
      location,
      requirements,
      sessionsPerWeek,
      status,
      source,
      notes,
      area,
      studyGoal,
    } = req.body;

    const requiredFields = [
      "tutorId",
      "studentId",
      "subject",
      "price",
      "grade",
      "location",
      "requirements",
      "sessionsPerWeek",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
       res.status(400).json({
        message: `Vui lòng cung cấp đầy đủ thông tin bắt buộc: ${missingFields.join(", ")}`,
      });
      return
    }

    // Kiểm tra định dạng
    if (!mongoose.Types.ObjectId.isValid(tutorId) || !mongoose.Types.ObjectId.isValid(studentId)) {
       res.status(400).json({
        message: "tutorId hoặc studentId không hợp lệ, phải là ObjectId",
      });
      return
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
       res.status(400).json({ message: "Price phải là số dương" });
       return
    }
    if (isNaN(Number(sessionsPerWeek)) || Number(sessionsPerWeek) <= 0) {
       res.status(400).json({ message: "sessionsPerWeek phải là số nguyên dương" });
       return
    }
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ message: "Status không hợp lệ" });
      return
    }

    // Kiểm tra tutor và student
    const [tutor, student] = await Promise.all([
      User.findById(tutorId).select("fullName"),
      Customer.findById(studentId).select("fullName"),
    ]);

    if (!tutor || !student) {
       res.status(404).json({
        message: "Không tìm thấy tutor hoặc student trong hệ thống",
      });
      return
    }

    const newAppointment = new Appointment({
      tutorId: new mongoose.Types.ObjectId(tutorId),
      studentId: new mongoose.Types.ObjectId(studentId),
      subject,
      price: Number(price),
      grade,
      location,
      requirements,
      sessionsPerWeek: Number(sessionsPerWeek),
      status: status || "pending",
      source,
      notes,
      area,
      studyGoal,
    });

    const savedAppointment = await newAppointment.save();

    // Gửi thông báo Kafka
    await sendAppointmentCreated({
      tutor: {
        id: tutorId,
        fullName: tutor.fullName || "Unknown Tutor",
      },
      student: {
        id: studentId,
        fullName: student.fullName || "Unknown Student",
      },
      appointmentId: savedAppointment._id,
    });

    res.status(201).json(savedAppointment);
  } catch (error: any) {
    console.error("❌ Error in createAppointment:", error);
    res.status(500).json({
      message: "Có lỗi xảy ra",
      error: error.message,
    });
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { tutorId, studentId, ...otherFields } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: "Không tìm thấy appointment" });
      return;
    }

    let updated = false;

    if (tutorId && mongoose.Types.ObjectId.isValid(tutorId)) {
      appointment.tutorId = new mongoose.Types.ObjectId(tutorId);
      updated = true;
    }

    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      appointment.studentId = new mongoose.Types.ObjectId(studentId);
      updated = true;
    }

    for (const [key, value] of Object.entries(otherFields)) {
      if (value !== undefined) {
        (appointment as any)[key] = value;
        updated = true;
      }
    }

    if (updated) {
      appointment.updatedAt = new Date();
      await appointment.save();
    }

    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      res.status(404).json({
        message: `Không tìm thấy appointment với id: ${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "Xóa appointment thành công",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi xóa",
      error: error.message,
    });
  }
};
