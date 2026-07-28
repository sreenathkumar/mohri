'use client'

import { Button } from "@/components/shadcn/button"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"

import { Table, TableBody, TableCell, TableRow } from '@/components/shadcn/table'
import { Textarea } from '@/components/shadcn/textarea'

export default function DataTable({ mode, phone, address }: { mode: string, phone: string, address: string }) {

    return (
        <div className="space-y-4 w-full">
            <Table>
                <TableBody className="[&_tr:last-child]:border">
                    <TableRow className={`border-muted border ${mode === 'view' && 'py-3'}`}>
                        <TableCell>
                            <Label htmlFor="phone">Phone Number</Label>
                        </TableCell>
                        <TableCell className="border-l border-muted ">
                            {
                                mode === 'edit' ? <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={phone}
                                /> : phone.length > 0 ? phone : 'your phone number'
                            }

                        </TableCell>
                    </TableRow>
                    <TableRow className={`border-muted border ${mode === 'view' && 'py-3'}`}>
                        <TableCell>
                            <Label htmlFor="address">Address</Label>
                        </TableCell>
                        <TableCell className="border-l border-muted" >
                            {mode === 'edit' ? <Textarea
                                id="address"
                                name="address"
                                defaultValue={address}
                            /> : address.length > 0 ? address : 'your address'}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {
                mode === 'edit' && <Button type="submit" className="w-full">Update Profile</Button>
            }
        </div>
    )
}

