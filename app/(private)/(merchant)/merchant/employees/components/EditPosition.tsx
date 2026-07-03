'use client'

import { useState } from 'react'
import { Button } from "@/components/shadcn/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { Pencil } from 'lucide-react'

interface BulkEditPositionProps {
    selectedEmployees: number[]
    onBulkEdit: (ids: number[], newPosition: string) => void
}

export default function EditPosition({ selectedEmployees, onBulkEdit }: BulkEditPositionProps) {
    const [open, setOpen] = useState(false)
    const [newPosition, setNewPosition] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onBulkEdit(selectedEmployees, newPosition)
        setOpen(false)
        setNewPosition('')
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={selectedEmployees.length === 0}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Positions ({selectedEmployees.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Positions for Selected Employees</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="newPosition">New Position</Label>
                        <Input
                            id="newPosition"
                            value={newPosition}
                            onChange={(e) => setNewPosition(e.target.value)}
                            placeholder="Enter new position"
                            required
                        />
                    </div>
                    <Button type="submit">Update Positions</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

