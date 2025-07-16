
import { auth } from "@/lib/auth";

const mockRoles = [
  { id: 1, role_name: "Admin", active_status: true },
  { id: 2, role_name: "Manager", active_status: true },
  { id: 3, role_name: "Guest", active_status: true }
];

export async function GET(): Promise<Response> {
  const session = await auth();

  if(!session){
    return Response.json({error: 'Unauthorized Access!'}, {status:401})
  }

  return Response.json(mockRoles);
}
