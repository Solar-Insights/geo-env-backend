import express from "express";
import { authRequiredPermissions } from "@/server/middlewares/prerequests";
import { CreateMyOrganizationMemberPayload, CustomAuth0JwtPayload, MyOrganizationMember } from "@/server/utils/types";
import {
    addMemberToMyOrganization,
    deleteMyOrganizationMember,
    getAllMyOrganizationMembers,
    getMyOrganizationDetails
} from "@/server/services/users";
import { getDecodedAccessTokenFromRequest } from "@/server/utils/helpers";
import { UserApi } from "@/api/apis/user";

const userRouter = express.Router();

userRouter.get(
    "/user/my-organization",
    authRequiredPermissions(["read:basic-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

        await getMyOrganizationDetails(userApi, decodedAccessToken)
            .then((myOrganization) => {
                res.status(200).locals.data = {
                    myOrganization: myOrganization
                };
                next();
            })
    }
);

userRouter.get(
    "/user/my-organization/members",
    authRequiredPermissions(["read:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

        await getAllMyOrganizationMembers(userApi, decodedAccessToken)
            .then((myOrganizationMembers) => {
                res.status(200).locals.data = {
                    myOrganizationMembers: myOrganizationMembers
                };
                next();
            })
    }
);

userRouter.post(
    "/user/my-organization/members",
    authRequiredPermissions(["write:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: CreateMyOrganizationMemberPayload = req.body;

        await addMemberToMyOrganization(userApi, decodedAccessToken, body)
            .then((myOrganizationMember) => {
                res.status(201).locals.data = {
                    myOrganizationMember: myOrganizationMember
                };
                next();
            })
    }
);

userRouter.delete(
    "/user/my-organization/members",
    authRequiredPermissions(["write:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: MyOrganizationMember = req.body.myOrganizationMember;

        await deleteMyOrganizationMember(userApi, decodedAccessToken, body)
            .then(() => {
                res.status(204);
                next();
            })
    }
);

export default userRouter;
