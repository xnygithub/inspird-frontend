import { FolderDetails as Fd } from "@/types/folders";
import { EditFolder } from "@/app/[username]/[folder]/components/edit/container";
import { FolderNav } from "@/app/[username]/[folder]/components/nav";


export const FolderDetails = async (
    { folder, canEdit }: { folder: Fd; canEdit: boolean }
) => {
    const totalCount = Object
        .values(folder.mediaCounts)
        .reduce((acc, item) => acc + item, 0);

    return (
        <>
            <FolderNav username={folder.owner.username} slug={folder.slug} />
            <div style={styles.container}>
                <h1 style={styles.name}>{folder.name}</h1>
                {canEdit && <EditFolder folder={folder} />}
            </div>
            {folder.description && <p style={styles.desc}>{folder.description}</p>}
            <div style={styles.details}>
                <p>{totalCount} Posts</p>
                <p>{folder.mediaCounts.image} images</p>
                <p>{folder.mediaCounts.video} videos</p>
                <p>{folder.mediaCounts.gif} gifs</p>
            </div>
            <div style={styles.details}>
                <p>Created {new Date(folder.createdAt).toLocaleDateString()}</p>
                <p>Updated {new Date(folder.lastUpdated).toLocaleDateString()}</p>
            </div>
        </>
    )
}


const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "6px",
        marginTop: "12px"
    },

    name: {
        fontSize: "30px",
        fontWeight: 500,
        lineHeight: 1.1,
        opacity: 0.9
    },

    desc: {
        fontWeight: 500,
        color: "#666",
    },

    details: {
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        fontSize: "14px",
        fontWeight: 400,
        opacity: 0.6
    }
} satisfies Record<string, React.CSSProperties>;