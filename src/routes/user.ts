import express from "express";
import { authRequiredPermissions } from "@/middlewares/requestHandlers";
import { MyOrganizationMember } from "@/services/types";

const userRouter = express.Router();

userRouter.get(
    "/user/my-organization",
    // authRequiredPermissions(["read:organization-user-access"]),
    async (req, res, next) => {
        res.status(200).locals.data = {
            myOrganization: {
                name: "Beneva",
                admins: [
                    {
                        created_date: "2024-05-01",
                        email: "user1@example.com",
                        name: "John Doe",
                        avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                    },
                    {
                        created_date: "2024-04-25",
                        email: "user2@example.com",
                        name: "Alice Smith",
                        avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                    },
                    {
                        created_date: "2024-04-30",
                        email: "mathisbeaudoin15@hotmail.com",
                        name: "Bob Johnson",
                        avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                    }
                ]
            }
        };

        next();
    }
);

userRouter.get(
    "/user/my-organization/members",
    // authRequiredPermissions(["read:organization-admin-access"]),
    async (req, res, next) => {
        res.status(200).locals.data = {
            myOrganizationMembers: [
                {
                    created_date: "2024-05-01",
                    email: "user1@example.com",
                    name: "John Doe",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-25",
                    email: "user2@example.com",
                    name: "Alice Smith",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-30",
                    email: "user3@example.com",
                    name: "Bob Johnson",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-27",
                    email: "user4@example.com",
                    name: "Emma Brown",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-05-02",
                    email: "user5@example.com",
                    name: "David Wilson",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-29",
                    email: "user6@example.com",
                    name: "Sophia Lee",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-26",
                    email: "user7@example.com",
                    name: "James Garcia",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2025-05-03",
                    email: "user8@example.com",
                    name: "Olivia Martinez",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-04-28",
                    email: "user9@example.com",
                    name: "William Rodriguez",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                },
                {
                    created_date: "2024-05-04",
                    email: "user10@example.com",
                    name: "Ava Hernandez",
                    avatar: "https://s.gravatar.com/avatar/ee05b160c94adaa5c69e28f130fd4b06?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fma.png"
                }
            ]
        };

        next();
    }
);

userRouter.post(
    "/user/my-organization/members", 
    // authRequiredPermissions(["write:organization-admin-access"]), 
    async (req, res, next) => {
        const body = req.body;

        const newOrganizationMember: MyOrganizationMember = {
            created_date: new Date().toISOString().substring(0, 10),
            email: body.email,
            name: body.name,
            avatar: ""
        }

        res.status(201).locals.data = {
            myOrganizationMember: newOrganizationMember
        }

        next();
});

userRouter.delete(
    "/user/my-organization/members", 
    // authRequiredPermissions(["write-organization-admin-access"]), 
    async (req, res, next) => {
        const body = req.body;

        res.status(204);

        next();
});

export default userRouter;
