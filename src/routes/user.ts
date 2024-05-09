import express from "express";
import { authRequiredPermissions } from "@/middlewares/requestHandlers";
import { CreateMyOrganizationMemberPayload, CustomAuth0JwtPayload, MyOrganizationMember } from "@/services/types";
import { addMemberToMyOrganization, deleteMyOrganizationMember, getAllMyOrganizationMembers, getMyOrganizationDetails } from "@/services/users";
import { getDecodedAccessTokenFromRequest } from "@/middlewares/responseHandlers";
import { jwtDecode } from "jwt-decode";

const userRouter = express.Router();

userRouter.get(
    "/user/my-organization",
    authRequiredPermissions(["read:basic-user-management"]),
    async (req, res, next) => {
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

        const myOrganization = await getMyOrganizationDetails(decodedAccessToken);

        res.status(200).locals.data = {
            myOrganization: myOrganization
        };
        next();
    }
);

userRouter.get(
    "/user/my-organization/members",
    authRequiredPermissions(["read:admin-user-management"]),
    async (req, res, next) => {
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;

        const myOrganizationMembers = await getAllMyOrganizationMembers(decodedAccessToken);

        res.status(200).locals.data = {
            myOrganizationMembers: myOrganizationMembers
        };
        next();
    }
);

userRouter.post(
    "/user/my-organization/members", 
    authRequiredPermissions(["write:admin-user-management"]), 
    async (req, res, next) => {
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: CreateMyOrganizationMemberPayload = req.body;

        const myOrganizationMember = await addMemberToMyOrganization(decodedAccessToken, body);

        res.status(201).locals.data = {
            myOrganizationMember: myOrganizationMember
        }
        next();
});

userRouter.delete(
    "/user/my-organization/members", 
    authRequiredPermissions(["write:admin-user-management"]), 
    async (req, res, next) => {
        const decodedAccessToken: CustomAuth0JwtPayload = getDecodedAccessTokenFromRequest(req)!;
        const body: MyOrganizationMember = req.body;

        await deleteMyOrganizationMember(decodedAccessToken, body);
        
        res.status(204);
        next();
});

export default userRouter;
