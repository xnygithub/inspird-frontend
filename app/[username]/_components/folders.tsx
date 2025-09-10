"use client"

import React from "react"

interface FoldersContainerProps {
    user_id: number
}


export default function FoldersContainer({ user_id }: FoldersContainerProps) {
    return <div>Folder for user {user_id}</div>

}   