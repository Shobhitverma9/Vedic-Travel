"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, Mail, Plus, Send, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"

export default function EmailBroadcastDashboard() {
    const [broadcasts, setBroadcasts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await apiClient.get<any[]>("/email-broadcast/history")
                setBroadcasts(data)
            } catch (error) {
                console.error("Failed to fetch history", error)
                toast.error("Failed to fetch broadcast history")
            } finally {
                setIsLoading(false)
            }
        }
        fetchHistory()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Email Broadcasting</h1>
                    <p className="text-muted-foreground">Manage and send mass emails to your subscribers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/email-broadcast/templates">
                        <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Manage Templates
                        </Button>
                    </Link>
                    <Link href="/admin/email-broadcast/send">
                        <Button>
                            <Send className="mr-2 h-4 w-4" />
                            New Broadcast
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Broadcasts</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{broadcasts.length}</div>
                    </CardContent>
                </Card>
                {/* Add more stats card if needed */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Broadcast History</CardTitle>
                    <CardDescription>A list of all recent email broadcasts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Recipients</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Success/Failure</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {broadcasts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No broadcast history found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                broadcasts.map((broadcast) => (
                                    <TableRow key={broadcast._id}>
                                        <TableCell>
                                            {format(new Date(broadcast.createdAt), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {broadcast.templateId?.name || "Deleted Template"}
                                        </TableCell>
                                        <TableCell>{broadcast.recipients?.length || 0}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                broadcast.status === 'sent' ? 'default' : 
                                                broadcast.status === 'failed' ? 'destructive' : 'secondary'
                                            }>
                                                {broadcast.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-green-600">{broadcast.successCount}</span>
                                            {" / "}
                                            <span className="text-red-600">{broadcast.failureCount}</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
