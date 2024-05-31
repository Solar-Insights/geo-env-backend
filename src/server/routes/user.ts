import express from "express";
import { authRequiredPermissions } from "@/server/middlewares/prerequests";
import {
    CreateMyOrganizationMemberPayload,
    CustomAuth0JwtPayload,
    MyOrganizationDetails,
    MyOrganizationMember
} from "@/server/utils/types";
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

        const myOrganization: MyOrganizationDetails = await getMyOrganizationDetails(userApi, decodedAccessToken);

        res.status(200).locals.data = {
            myOrganization: myOrganization
        };
        next();
        return;
    }
);

userRouter.get(
    "/user/my-organization/members",
    authRequiredPermissions(["read:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

        const myOrganizationMembers: MyOrganizationMember[] = await getAllMyOrganizationMembers(
            userApi,
            decodedAccessToken
        );

        res.status(200).locals.data = {
            myOrganizationMembers: myOrganizationMembers
        };
        next();
        return;
    }
);

userRouter.post(
    "/user/my-organization/members",
    authRequiredPermissions(["write:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: CreateMyOrganizationMemberPayload = req.body;

        const myOrganizationMember: MyOrganizationMember = await addMemberToMyOrganization(
            userApi,
            decodedAccessToken,
            body
        );

        res.status(201).locals.data = {
            myOrganizationMember: myOrganizationMember
        };
        next();
        return;
    }
);

userRouter.delete(
    "/user/my-organization/members",
    authRequiredPermissions(["write:admin-user-management"]),
    async (req, res, next) => {
        const userApi = new UserApi(req);
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: MyOrganizationMember = req.body.myOrganizationMember;

        await deleteMyOrganizationMember(userApi, decodedAccessToken, body);

        res.status(204);
        next();
        return;
    }
);

export default userRouter;
