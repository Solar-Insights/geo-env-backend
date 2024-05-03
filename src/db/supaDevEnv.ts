/*
    - Run using:
    npx tsx src/db/test.ts
*/
import { createTeam, deleteTeamById, getTeamById } from "@/db/teams/operations";
import { createUser, getUserByAuth0IdAndEmail } from "@/db/users/operations";

const userId = "2m5fiinQSDYS5Zvw1K5SWJjGkKUSgANi";
const userEmail = "mathisbeaudoin15@hotmail.com";
const teamId = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imc5dTZaYUdJbkk0YUM5bFpwMkM0UiJ9"

await deleteTeamById(teamId)

await createTeam({ 
    id: teamId,
    team_name: "test",
    contact_email: "mathis.beaudoin@protonmail.com",
    contact_phone_number: "418 255-7097",
    contact_name: "Admin"
})

await createUser({
    auth0_id: userId,
    email: userEmail,
    name: "Testeur",
    team_id: teamId  
})

const user = await getUserByAuth0IdAndEmail(userId, userEmail);
console.log(user);

const team = await getTeamById(teamId);
console.log(team);
