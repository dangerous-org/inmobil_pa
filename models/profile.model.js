import { request, response } from "express";
import conn from "../database/dbConnection.js";
import { uploadPicture } from "../tools/cloudinary.js";

class ProfileModel {
  constructor() {}

  static async createProfile(req = request, res = response) {
    try {
      const { user_id } = req.user;
      const { biography } = req.body;
      const [profileFind] = await conn.query(
        "Select * from profiles where user_id = ?",
        [user_id]
      );
      if (profileFind.length > 0) {
        return res.status(400).json({
          message: "This profile already exist",
        });
      }
      await conn.query("insert into profiles(user_id,biography) values(?,?)", [
        user_id,
        biography,
      ]);
      return res.status(201).json({
        message: "Profile has been created successfully",
      });
    } catch (err) {
      console.log(err, "=> Server has failed");
      return res.status(500).json({
        message: "An error has ocurred",
      });
    }
  }

  static async putPhoto(req = request, res = response) {
    try {
      const { photo } = req.files;
      const { user_id } = req.user;

      if (!photo) {
        return res.status(400).json({
          message: "You must have selected a file",
        });
      }

      const urlFoto = await uploadPicture(photo.tempFilePath).then(
        (picture) => {
          return picture.secure_url;
        }
      );

      await conn.query("update profiles set foto = ? where user_id = ?", [
        urlFoto,
        user_id,
      ]);

      return res.status(200).json({
        message: "Photo has uploaded successfully",
      });
    } catch (err) {
      console.log(err, "=> server failed");
      return res.status(500).json({
        message: "an error has ocurred",
      });
    }
  }

  static async putBanner(req = request, res = response) {
    try {
      const { banner } = req.files;
      const { user_id } = req.user;

      if (!banner) {
        return res.status(400).json({
          message: "You must have selected a file",
        });
      }

      const urlBanner = await uploadPicture(banner.tempFilePath).then(
        (picture) => {
          return picture.secure_url;
        }
      );

      await conn.query("update profiles set banner = ? where user_id = ?", [
        urlBanner,
        user_id,
      ]);

      return res.status(200).json({
        message: "Banner has uploaded successfully",
      });
    } catch (err) {
      console.log(err, "=> server failed");
      return res.status(500).json({
        message: "an error has ocurred",
      });
    }
  }

  static async putBiography(req = request, res = response) {
    try {
      const { user_id } = req.user;
      const { biography } = req.body;

      await conn.query("update profiles set biography = ? where user_id = ?", [
        biography,
        user_id,
      ]);
      return res.status(201).json({
        message: "Biography has been changed successfully",
      });
    } catch (err) {
      console.log(err, "=> server has failed");
      return res.status(500).json({
        message: "an error has ocurred",
      });
    }
  }

  static async getProfile(req = request, res = response) {
    try {
      const { user_id } = req.params;
      const [userProfile] = await conn.query("call getProfile(?)", [user_id]);
      return res.status(200).json({ profile: userProfile[0] });
    } catch (error) {
      console.log(error, "=> get profile");
      return res.status(500).json({ message: "profile could not be found" });
    }
  }

  static async followUser(req = request, res = response) {}
}

export default ProfileModel;
