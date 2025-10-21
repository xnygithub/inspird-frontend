import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';
import { useCanvas } from '../provider';
import { GroupItem } from '../types';
import { Button } from '@/components/ui/button';



export default function GroupEditor({
    group
}:
    { group: GroupItem }
) {
    const { patchGroup } = useCanvas();
    const [groupName, setGroupName] = useState(group.title);

    const name = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value);
    };

    const save = () => {
        patchGroup(group.id, { title: groupName });
    }

    useEffect(() => {
        setGroupName(group.title);
    }, [group]);

    return (
        <div style={styles} >
            <h1>Group Editor</h1>
            <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={name}
            />
            <Button onClick={save}>Save</Button>
        </div>
    )
}

const styles: React.CSSProperties = {
    position: 'absolute',
    top: 80,
    right: 40,
    backgroundColor: 'white',
    padding: '1rem',
    width: '300px',
    height: '300px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'black',
}