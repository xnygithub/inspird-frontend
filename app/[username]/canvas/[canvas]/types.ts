import { Database } from "@/database.types";


type Canvas = Database["public"]["Tables"]["canvas_doc"]["Row"];
type Owner = {
    username: string;
    id: string;
};

export type CanvasDoc = Canvas & {
    owner: Owner;
}