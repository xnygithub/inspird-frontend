import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteCanvasDoc } from "@/lib/queries/canvas"
import { createClient } from "@/utils/supabase/client"

export default function DeleteButton({ canvasId }: { canvasId: string }) {
    const supabase = createClient()

    const handleDelete = async () => {
        const { error } = await deleteCanvasDoc(supabase, canvasId)
        if (!error) {
            console.log("Canvas deleted successfully")
        } else {
            console.log("Error deleting canvas", error.message)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Canvas</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this canvas?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}