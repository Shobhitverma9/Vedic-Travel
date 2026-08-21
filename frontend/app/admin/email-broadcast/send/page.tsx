"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Send, Loader2, Eye, Upload } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function SendBroadcastPage() {
    const router = useRouter()
    const [templates, setTemplates] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [formData, setFormData] = useState({
        templateId: "",
        recipientType: "manual" as "all" | "manual",
        recipients: "",
    })

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const { data } = await apiClient.get<any[]>("/email-broadcast/templates")
                setTemplates(data)
            } catch (error) {
                toast.error("Failed to fetch templates")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTemplates()
    }, [])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                // Support CSV, TXT, or simple lists (one email per line or comma/semicolon separated)
                const emails = content
                    .split(/[\n,;]+/)
                    .map(e => e.trim())
                    .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)); // Basic email regex
                
                if (emails.length === 0) {
                    toast.error("No valid email addresses found in the file.");
                } else {
                    const existing = formData.recipients ? formData.recipients.split(",").map(e => e.trim()) : [];
                    const combined = Array.from(new Set([...existing, ...emails])).filter(e => !!e);
                    
                    setFormData(prev => ({
                        ...prev,
                        recipients: combined.join(", ")
                    }));
                    toast.success(`Successfully loaded ${emails.length} email addresses.`);
                }
            }
            // Reset file input
            e.target.value = "";
        };
        reader.readAsText(file);
    };

    const handleSend = async () => {
        if (!formData.templateId) {
            toast.error("Please select a template")
            return
        }

        if (formData.recipientType === "manual" && !formData.recipients) {
            toast.error("Please enter at least one recipient")
            return
        }

        setIsSending(true)
        try {
            const payload = {
                templateId: formData.templateId,
                recipientType: formData.recipientType,
                recipients: formData.recipientType === "manual" 
                    ? formData.recipients.split(",").map(e => e.trim()).filter(e => !!e)
                    : []
            }

            await apiClient.post("/email-broadcast/send", payload)
            toast.success("Broadcast started successfully")
            router.push("/admin/email-broadcast")
        } catch (error) {
            toast.error("Failed to start broadcast")
        } finally {
            setIsSending(false)
        }
    }

    const selectedTemplate = templates.find(t => t._id === formData.templateId)

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/email-broadcast">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">New Broadcast</h1>
                <Button className="ml-auto" size="lg" onClick={handleSend} disabled={isSending}>
                    {isSending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Now
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>1. Select Template</CardTitle>
                        <CardDescription>Choose the email content you want to send.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Select 
                                value={formData.templateId} 
                                onValueChange={(val) => setFormData({ ...formData, templateId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map((template) => (
                                        <SelectItem key={template._id} value={template._id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedTemplate && (
                            <div className="flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Preview Template
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Preview: {selectedTemplate.subject}</DialogTitle>
                                        </DialogHeader>
                                        <div 
                                            className="border rounded-md p-6 bg-white"
                                            dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlBody }}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Select Recipients</CardTitle>
                        <CardDescription>Who should receive this email?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup 
                            value={formData.recipientType} 
                            onValueChange={(val: any) => setFormData({ ...formData, recipientType: val })}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="all" />
                                <Label htmlFor="all" className="font-normal cursor-pointer">
                                    <strong>All Users</strong> - Send to all registered devotees in the database
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="manual" id="manual" />
                                <Label htmlFor="manual" className="font-normal cursor-pointer">
                                    <strong>Manual</strong> - Enter specific email addresses
                                </Label>
                            </div>
                        </RadioGroup>

                        {formData.recipientType === "manual" && (
                            <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="recipients">Email Addresses (comma separated)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept=".csv,.txt"
                                            onChange={handleFileUpload}
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            type="button"
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload CSV/TXT
                                        </Button>
                                    </div>
                                </div>
                                <textarea
                                    id="recipients"
                                    className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="devotee1@example.com, devotee2@example.com"
                                    value={formData.recipients}
                                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    You can paste comma-separated emails or upload a CSV/TXT file. Valid emails will be automatically extracted.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
