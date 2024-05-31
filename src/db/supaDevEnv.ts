/*
    - Run using:
    npx tsx src/db/test.ts
*/
import { createTeam, getTeamById } from "@/db/teams/operations";
import { createUser, getUserByEmail } from "@/db/users/operations";

const userId = "2m5fiinQSDYS5Zvw1K5SWJjGkKUSgANi";
const userEmail = "mathisbeaudoin15@hotmail.com";
const teamId = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imc5dTZaYUdJbkk0YUM5bFpwMkM0UiJ9";

await createTeam({
    id: teamId,
    team_name: "test",
    contact_email: "mathis.beaudoin@protonmail.com",
    contact_phone_number: "418 255-7097",
    contact_name: "Admin"
});

await createUser({
    auth0_id: userId,
    email: userEmail,
    name: "Testeur",
    team_id: teamId
});

const user = await getUserByEmail(userEmail);
console.log(user);

const team = await getTeamById(teamId);
console.log(team);

/**
    Billing date should be set on creation of a team. 
    - Is the same numerical day as the as the creation date of the team
    - If number is not below 28 (29-30-31) then changes it to the 1st of every month to avoid problems
*/
