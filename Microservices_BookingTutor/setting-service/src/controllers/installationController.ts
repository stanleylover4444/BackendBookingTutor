import { Request, Response } from "express";
import { Installation } from "../models/installationModel";

export const createInstallation = async (
  req: Request,
  res: Response
): Promise<void> => {
  let response = { status: 500, data: { message: "Lỗi server", error: "" } };

  try {
    const { idUsers, deviceToken } = req.body;

    if (!idUsers || !deviceToken?.token || !deviceToken?.os) {
      response = {
        status: 400,
        data: { message: "idUsers và deviceToken là bắt buộc", error: "" },
      };
    } else {
      const existingInstallation = await Installation.findOne({ idUsers });

      if (existingInstallation) {
        const tokenExists = existingInstallation.deviceToken.some(
          (item) => item.token === deviceToken.token
        );

        if (!tokenExists) {
          existingInstallation.deviceToken.push(deviceToken);
          await existingInstallation.save();
          response = {
            status: 200,
            data: { message: "Token được thêm thành công", error: "" },
          };
        } else {
          response = {
            status: 200,
            data: { message: "Token đã tồn tại", error: "" },
          };
        }
      } else {
        const newInstallation = await Installation.create({
          idUsers,
          deviceToken: [deviceToken], // ⬅️ Đưa object vào mảng
        });

        response = {
          status: 201,
          data: { message: "Tạo mới thành công", error: "" },
        };
      }
    }
  } catch (error: any) {
    response = {
      status: 500,
      data: { message: "Lỗi server", error: error.message },
    };
  }

  res.status(response.status).json(response.data);
};

export const deleteInstallationToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  let response = { status: 500, data: { message: "Lỗi server", error: "" } };

  try {
    const { idUsers, deviceToken } = req.body;

    if (!idUsers || !deviceToken?.token) {
      response = {
        status: 400,
        data: { message: "idUsers và deviceToken là bắt buộc", error: "" },
      };
    } else {
      const installation = await Installation.findOne({ idUsers });

      if (!installation) {
        response = {
          status: 404,
          data: { message: "Không tìm thấy installation", error: "" },
        };
      } else {
        const tokenExists = installation.deviceToken.some(
          (item) => item.token === deviceToken.token
        );

        if (tokenExists) {
          installation.deviceToken = installation.deviceToken.filter(
            (item) => item.token !== deviceToken.token
          );
          await installation.save();
          response = {
            status: 200,
            data: { message: "Xóa token thành công", error: "" },
          };
        } else {
          response = {
            status: 200,
            data: { message: "Token không tồn tại", error: "" },
          };
        }
      }
    }
  } catch (error: any) {
    response = {
      status: 500,
      data: { message: "Lỗi server", error: error.message },
    };
  }

  res.status(response.status).json(response.data);
};
