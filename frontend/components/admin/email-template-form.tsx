"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import apiClient from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, GripVertical, Plus, ArrowLeft, Save, Loader2, Eye, Download, Search, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { renderEmailHtml, type Section } from "@/lib/email-renderer"

const sectionSchema = z.object({
    type: z.enum(['stats', 'content', 'donation', 'grid', 'media', 'custom_donation', 'image', 'hero', 'pricing_tiers']),
    content: z.any()
})

const emailTemplateSchema = z.object({
    name: z.string().min(1, "Internal name is required"),
    subject: z.string().min(1, "Email Subject is required"),
    sections: z.array(sectionSchema).optional()
})

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>

interface EmailTemplateFormProps {
    id?: string
}

function TextToolbar({ textareaId, form, fieldName }: { textareaId: string, form: any, fieldName: string }) {
    const insertTag = (tag: string, endTag?: string) => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const replacement = endTag 
            ? `<${tag}>${selected}</${endTag || tag}>`
            : `<${tag}>${selected}`;
        
        const newValue = before + replacement + after;
        form.setValue(fieldName, newValue);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
        }, 0);
    };

    return (
        <div className="flex items-center gap-1 mb-1 border rounded-t-md p-1 bg-muted/50 w-fit">
            <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertTag('b', 'b')}
                title="Bold"
            >
                <span className="font-bold">B</span>
            </Button>
            <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => insertTag('i', 'i')}
                title="Italic"
            >
                <span className="italic">I</span>
            </Button>
            <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => {
                    const url = prompt("Enter URL:", "https://");
                    if (url) {
                        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const selected = text.substring(start, end);
                        const replacement = `<a href="${url}" class="text-primary hover:underline font-semibold" target="_blank">${selected || 'link'}</a>`;
                        form.setValue(fieldName, text.substring(0, start) + replacement + text.substring(end));
                    }
                }}
                title="Hyperlink"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    );
}

function ImportTourDialog({ onImport }: { onImport: (items: any[]) => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [items, setItems] = useState<any[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const [toursRes, yatrasRes] = await Promise.all([
                apiClient.get("/tours"),
                apiClient.get("/yatras")
            ])

            const allItems: any[] = []
            
            // Assuming response could be paginated { data: ... } or array
            const toursData = Array.isArray(toursRes.data) ? toursRes.data : (toursRes.data?.tours || toursRes.data?.data || []);
            const yatrasData = Array.isArray(yatrasRes.data) ? yatrasRes.data : (yatrasRes.data?.yatras || yatrasRes.data?.data || []);

            toursData.forEach((item: any) => {
                allItems.push({
                    id: `tour-${item._id}`,
                    source: `Tour`,
                    title: item.title,
                    description: item.description?.substring(0, 100) + '...' || "",
                    amount: item.price ? String(item.price) : "",
                    image: (item.images && item.images.length > 0) ? item.images[0] : "",
                    link: `https://vedictravel.com/tours/${item.slug}`
                })
            })

            yatrasData.forEach((item: any) => {
                allItems.push({
                    id: `yatra-${item._id}`,
                    source: `Yatra`,
                    title: item.title,
                    description: item.description?.substring(0, 100) + '...' || "",
                    amount: "", // Yatras might not have direct price
                    image: item.cardImage || item.heroImage || "",
                    link: `https://vedictravel.com/yatras/${item.slug}`
                })
            })
            // (removed scheme and lp logic)

            // Filter out exact duplicates based on title and amount
            const uniqueItems = allItems.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.title === item.title && t.amount === item.amount
                ))
            )

            setItems(uniqueItems)
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch donation items")
        } finally {
            setLoading(false)
        }
    }

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.source.toLowerCase().includes(search.toLowerCase())
    )

    const handleImport = () => {
        const selectedItems = items.filter(item => selectedIds.includes(item.id))
        onImport(selectedItems.map(({ source, id, ...rest }) => rest))
        setOpen(false)
        setSelectedIds([])
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (val && items.length === 0) fetchItems()
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" type="button" onClick={() => setOpen(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Import Tours
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Import Tours / Yatras</DialogTitle>
                    <DialogDescription>
                        Select packages to add to this section.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or source..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 min-h-[300px] border rounded-md p-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">No items found</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        if (selectedIds.includes(item.id)) {
                                            setSelectedIds(selectedIds.filter(id => id !== item.id))
                                        } else {
                                            setSelectedIds([...selectedIds, item.id])
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-4 p-3 rounded-md border cursor-pointer transition-colors",
                                        selectedIds.includes(item.id) ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className="h-12 w-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{item.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</div>
                                        {item.amount && <div className="text-sm font-medium text-primary mt-1">₹{item.amount}</div>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        readOnly
                                        className="h-4 w-4 accent-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="text-sm font-medium mb-2">
                        {selectedIds.length} items selected
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleImport} disabled={selectedIds.length === 0}>
                            Import Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function PricingTierFeaturesForm({ nestIndex, cardIndex, form }: { nestIndex: number, cardIndex: number, form: any }) {
    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: `sections.${nestIndex}.content.cards.${cardIndex}.features`
    })

    return (
        <div className="space-y-2 mt-4">
            <Label className="text-muted-foreground flex justify-between items-center bg-muted/60 p-2 rounded-t-md">
                List Features
                <Button type="button" variant="ghost" size="sm" className="h-6 text-xs px-2 bg-background border" onClick={() => append({ text: "" })}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
            </Label>
            <div className="space-y-3 bg-muted/20 p-2 rounded-b-md border border-t-0">
                {fields.map((feature, fIdx) => (
                    <div key={feature.id} className="flex gap-2 items-start border-b pb-3 relative">
                        <div className="flex-1 space-y-1">
                            <Label className="text-[10px]">Description Text</Label>
                            <Input {...form.register(`sections.${nestIndex}.content.cards.${cardIndex}.features.${fIdx}.text`)} className="text-xs h-8" placeholder="Feature description..." />
                        </div>
                        <div className="flex flex-col gap-1 items-center mt-5">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(fIdx)} className="h-6 w-6 text-destructive rounded bg-destructive/10">
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PricingTiersSectionForm({ nestIndex, form }: { nestIndex: number, form: any }) {
    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: `sections.${nestIndex}.content.cards`
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-semibold">Pricing Cards (Max 3 per row recommended)</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ 
                    title: "New Tier", 
                    price: "1000", 
                    headerColor: "#FF9933", 
                    features: [{ text: "New feature" }], 
                    buttonText: "Donate Now", 
                    buttonLink: "" 
                })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Card
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((card, k) => (
                    <div key={card.id} className="border p-4 rounded-md space-y-4 relative bg-muted/10 shadow-sm">
                        <div className="absolute top-2 right-2 z-10 flex items-center bg-background border rounded-md overflow-hidden shadow-sm">
                            <Button type="button" variant="ghost" size="icon" onClick={() => move(k, k - 1)} disabled={k === 0} className="text-muted-foreground h-7 w-7 rounded-none border-r">
                                <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => move(k, k + 1)} disabled={k === fields.length - 1} className="text-muted-foreground h-7 w-7 rounded-none border-r">
                                <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="text-destructive h-7 w-7 rounded-none">
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>

                        <div className="space-y-3 pt-6">
                            <div className="space-y-1">
                                <Label>Header Image (Optional)</Label>
                                <ImageUpload
                                    value={form.watch(`sections.${nestIndex}.content.cards.${k}.headerImage`)}
                                    onChange={(url) => form.setValue(`sections.${nestIndex}.content.cards.${k}.headerImage`, url)}
                                />
                                <p className="text-[10px] text-muted-foreground italic">If image is present, header color and title are hidden.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label>Header Title</Label>
                                    <Input {...form.register(`sections.${nestIndex}.content.cards.${k}.title`)} placeholder="1 SQUARE FOOT" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Header Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" {...form.register(`sections.${nestIndex}.content.cards.${k}.headerColor`)} className="w-10 h-8 p-1" />
                                        <Input {...form.register(`sections.${nestIndex}.content.cards.${k}.headerColor`)} placeholder="#FF9933" className="font-mono text-xs uppercase" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Price / Amount (₹)</Label>
                                <Input {...form.register(`sections.${nestIndex}.content.cards.${k}.price`)} placeholder="1000" type="number" />
                            </div>

                            <PricingTierFeaturesForm nestIndex={nestIndex} cardIndex={k} form={form} />

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                                <div className="space-y-1">
                                    <Label>Button Text</Label>
                                    <Input {...form.register(`sections.${nestIndex}.content.cards.${k}.buttonText`)} placeholder="Donate Now" />
                                </div>
                                <div className="space-y-1">
                                    <Label>Button Link</Label>
                                    <Input {...form.register(`sections.${nestIndex}.content.cards.${k}.buttonLink`)} placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function EmailTemplateForm({ id }: EmailTemplateFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(!!id)
    const [isSaving, setIsSaving] = useState(false)
    const [previewHtml, setPreviewHtml] = useState<string | null>(null)

    const form = useForm<EmailTemplateFormValues>({
        resolver: zodResolver(emailTemplateSchema),
        defaultValues: {
            name: "",
            subject: "",
            sections: []
        }
    })

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "sections"
    })

    useEffect(() => {
        if (id) {
            const fetchTemplate = async () => {
                try {
                    const { data } = await apiClient.get<any>(`/email-broadcast/templates/${id}`)
                    form.reset({
                        name: data.name || "",
                        subject: data.subject || "",
                        sections: data.design || []
                    })
                } catch (error) {
                    toast.error("Failed to load template")
                    router.push("/admin/email-broadcast/templates")
                } finally {
                    setIsLoading(false)
                }
            }
            fetchTemplate()
        }
    }, [id, router, form])

    const onSubmit = async (data: EmailTemplateFormValues) => {
        setIsSaving(true)
        try {
            const generatedHtml = renderEmailHtml((data.sections || []) as Section[])

            const payload = {
                name: data.name,
                subject: data.subject,
                design: data.sections || [],
                htmlBody: generatedHtml
            }

            if (id) {
                await apiClient.put(`/email-broadcast/templates/${id}`, payload)
                toast.success("Template updated successfully")
            } else {
                await apiClient.post("/email-broadcast/templates", payload)
                toast.success("Template created successfully")
            }
            router.push("/admin/email-broadcast/templates")
            router.refresh()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save template")
        } finally {
            setIsSaving(false)
        }
    }

    const addSection = (type: NonNullable<EmailTemplateFormValues['sections']>[number]['type']) => {
        let defaultContent = {}
        switch (type) {
            case 'pricing_tiers':
                defaultContent = { cards: [{ title: "1 SQUARE FOOT", price: "1000", headerColor: "#FF9933", features: [{ text: "Feature detail" }], buttonText: "Donate Now", buttonLink: "" }] }
                break
            case 'hero':
                defaultContent = { backgroundImage: "", title: "", textColor: "#ffffff" }
                break
            case 'image':
                defaultContent = { image: "", link: "", alt: "" }
                break
            case 'stats':
                defaultContent = { items: [{ value: "500+", label: "Daily Feeds" }] }
                break
            case 'content':
                defaultContent = { blocks: [{ type: 'h2', text: "Section Heading", color: "#000000" }] }
                break
            case 'donation':
                defaultContent = { items: [{ image: "", title: "", description: "Description", itemQty: "1 Unit", amount: "" }] }
                break
            case 'grid':
                defaultContent = { image: "", text: "Content text here...", reversed: false }
                break
            case 'media':
                defaultContent = { videoUrl: "" }
                break
            case 'custom_donation':
                defaultContent = {
                    title: "Donate Amount Of Your Choice",
                    bankDetails: {
                        bankName: "ICICI BANK",
                        accountName: "ISKCON",
                        accountNumber: "628601046447",
                        ifscCode: "ICIC0006286"
                    },
                    upiDetails: {
                        qrImage: "",
                        upiId: "iskcon.62585952@hdfcbank"
                    }
                }
                break
        }
        append({ type, content: defaultContent })
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id);
            const newIndex = fields.findIndex((f) => f.id === over.id);
            move(oldIndex, newIndex);
        }
    };

    if (isLoading) {
        return (
             <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/email-broadcast/templates">
                    <Button type="button" variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {id ? "Edit Email Template" : "New Email Template"}
                </h1>
                
                <Dialog>
                    <DialogTrigger asChild>
                         <Button type="button" variant="secondary" className="ml-auto bg-muted/50 hover:bg-muted" 
                            onClick={() => setPreviewHtml(renderEmailHtml((form.getValues().sections || []) as Section[]))}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview Email
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-100">
                        <DialogHeader className="p-4 border-b bg-white">
                            <DialogTitle>Email Preview</DialogTitle>
                            <DialogDescription>
                                This is roughly how the email will look to the recipients.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
                            <div className="bg-white shadow-xl overflow-hidden w-full max-w-[600px] h-fit min-h-full">
                                <iframe 
                                    srcDoc={previewHtml || ''} 
                                    className="w-full h-[800px] border-0 outline-none block" 
                                    title="Email Preview"
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Template
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Template Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Internal Name</Label>
                        <Input {...form.register("name")} placeholder="e.g. Navratri Special Email" />
                        {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Email Subject</Label>
                        <Input {...form.register("subject")} placeholder="e.g. Celebrate Navratri with us!" />
                        {form.formState.errors.subject && <p className="text-red-500 text-sm">{form.formState.errors.subject.message}</p>}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">Email Sections Builder</h2>
                    <Select onValueChange={(val: any) => addSection(val)}>
                        <SelectTrigger className="w-full sm:w-[300px]">
                            <SelectValue placeholder="+ Add Email Block" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="content">Content (Header/Text)</SelectItem>
                            <SelectItem value="hero">Hero Header (BG Image)</SelectItem>
                            <SelectItem value="stats">Statistics (Numbers)</SelectItem>
                            <SelectItem value="donation">Donation Items</SelectItem>
                            <SelectItem value="custom_donation">Custom Donation (Bank/QR)</SelectItem>
                            <SelectItem value="grid">Grid (Image + Text)</SelectItem>
                            <SelectItem value="pricing_tiers">Pricing Tiers (Cards)</SelectItem>
                            <SelectItem value="image">Banner Image (Full Width)</SelectItem>
                            <SelectItem value="media">Media (Video Link)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border text-center">
                    Build your email layout visually! The standard ISKCON header and footer will be automatically added around these blocks when sent.
                </p>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        <Accordion type="multiple" className="space-y-4">
                            {fields.map((field, index) => (
                                <SortableAccordionItem key={field.id} id={field.id}>
                                    <AccordionItem value={field.id} className="border rounded-lg bg-card text-card-foreground">
                                        <div className="flex items-center px-4">
                                            <DragHandleTrigger id={field.id} />
                                            <AccordionTrigger className="hover:no-underline flex-1 pl-2">
                                                <span className="font-semibold uppercase text-sm">{field.type.replace('_', ' ')} Block</span>
                                            </AccordionTrigger>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <AccordionContent className="px-4 pb-4 pt-0">
                                            {field.type === 'stats' && <StatsSectionForm nestIndex={index} form={form} />}
                                            {field.type === 'content' && <ContentSectionForm nestIndex={index} form={form} />}
                                            {field.type === 'donation' && <DonationSectionForm nestIndex={index} form={form} />}
                                            {field.type === 'grid' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Image (Ideal width: 250px-300px)</Label>
                                                        <ImageUpload
                                                            value={form.watch(`sections.${index}.content.image`)}
                                                            onChange={(url) => form.setValue(`sections.${index}.content.image`, url)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Text Content</Label>
                                                        <TextToolbar textareaId={`grid-text-${index}`} form={form} fieldName={`sections.${index}.content.text`} />
                                                        <Textarea id={`grid-text-${index}`} {...form.register(`sections.${index}.content.text`)} className="h-40" />
                                                        <div className="flex items-center space-x-2 pt-2">
                                                            <Switch
                                                                checked={form.watch(`sections.${index}.content.reversed`)}
                                                                onCheckedChange={(c) => form.setValue(`sections.${index}.content.reversed`, c)}
                                                            />
                                                            <Label className="text-xs font-normal">Image on Right Side</Label>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <div>
                                                                <Label>Button Text (Optional)</Label>
                                                                <Input {...form.register(`sections.${index}.content.buttonText`)} placeholder="Learn More" />
                                                            </div>
                                                            <div>
                                                                <Label>Button Link (Optional)</Label>
                                                                <Input {...form.register(`sections.${index}.content.buttonLink`)} placeholder="https://..." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {field.type === 'hero' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Hero Background Image</Label>
                                                        <ImageUpload
                                                            value={form.watch(`sections.${index}.content.backgroundImage`)}
                                                            onChange={(url) => form.setValue(`sections.${index}.content.backgroundImage`, url)}
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>Hero Title / Main Text</Label>
                                                            <TextToolbar textareaId={`hero-text-${index}`} form={form} fieldName={`sections.${index}.content.title`} />
                                                            <Textarea id={`hero-text-${index}`} {...form.register(`sections.${index}.content.title`)} placeholder="e.g. Welcome to ISKCON" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Text Color</Label>
                                                            <div className="flex gap-2">
                                                                <Input type="color" {...form.register(`sections.${index}.content.textColor`)} className="w-12 h-10 p-1" />
                                                                <Input {...form.register(`sections.${index}.content.textColor`)} placeholder="#ffffff" className="font-mono uppercase" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {field.type === 'pricing_tiers' && (
                                                <PricingTiersSectionForm nestIndex={index} form={form} />
                                            )}
                                            {field.type === 'image' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Image (Ideal width: 600px)</Label>
                                                        <ImageUpload
                                                            value={form.watch(`sections.${index}.content.image`)}
                                                            onChange={(url) => form.setValue(`sections.${index}.content.image`, url)}
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>Alt Text (For accessibility)</Label>
                                                            <Input {...form.register(`sections.${index}.content.alt`)} placeholder="e.g. Festival Celebration Banner" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Click Link (Optional)</Label>
                                                            <Input {...form.register(`sections.${index}.content.link`)} placeholder="https://..." />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {field.type === 'media' && (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>YouTube Video URL (Displays as a link button in email)</Label>
                                                        <Input {...form.register(`sections.${index}.content.videoUrl`)} placeholder="https://youtube.com/..." />
                                                    </div>
                                                </div>
                                            )}
                                            {field.type === 'custom_donation' && <CustomDonationSectionForm nestIndex={index} form={form} />}
                                        </AccordionContent>
                                    </AccordionItem>
                                </SortableAccordionItem>
                            ))}
                        </Accordion>
                    </SortableContext>
                </DndContext>
            </div>
        </form>
    )
}

function SortableAccordionItem({ id, children }: { id: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return <div ref={setNodeRef} style={style} className="mb-4">{children}</div>;
}

function DragHandleTrigger({ id }: { id: string }) {
    const { listeners, attributes } = useSortable({ id });
    return (
        <span {...listeners} {...attributes} className="cursor-move mr-2">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
        </span>
    );
}

function StatsSectionForm({ nestIndex, form }: { nestIndex: number, form: any }) {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: `sections.${nestIndex}.content.items` })
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                {fields.map((item, k) => (
                    <div key={item.id} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label>Number/Value</Label>
                            <Input {...form.register(`sections.${nestIndex}.content.items.${k}.value`)} placeholder="e.g. 500+" />
                        </div>
                        <div className="flex-1">
                            <Label>Label</Label>
                            <Input {...form.register(`sections.${nestIndex}.content.items.${k}.label`)} placeholder="e.g. Daily Feeds" />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="text-destructive mb-0.5"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "", label: "" })}><Plus className="mr-2 h-4 w-4" /> Add Stat</Button>
        </div>
    )
}

function ContentSectionForm({ nestIndex, form }: { nestIndex: number, form: any }) {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: `sections.${nestIndex}.content.blocks` })
    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {fields.map((item, k) => (
                    <div key={item.id} className="border p-4 rounded-md flex flex-col gap-3 relative bg-muted/20">
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="absolute top-2 right-2 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Type</Label>
                                <Select value={form.watch(`sections.${nestIndex}.content.blocks.${k}.type`)} onValueChange={(val) => form.setValue(`sections.${nestIndex}.content.blocks.${k}.type`, val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="h1">Heading 1 (H1)</SelectItem>
                                        <SelectItem value="h2">Heading 2 (H2)</SelectItem>
                                        <SelectItem value="h3">Heading 3 (H3)</SelectItem>
                                        <SelectItem value="h4">Heading 4 (H4)</SelectItem>
                                        <SelectItem value="h5">Heading 5 (H5)</SelectItem>
                                        <SelectItem value="h6">Heading 6 (H6)</SelectItem>
                                        <SelectItem value="p">Paragraph</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Alignment</Label>
                                <Select value={form.watch(`sections.${nestIndex}.content.blocks.${k}.align`) || "left"} onValueChange={(val) => form.setValue(`sections.${nestIndex}.content.blocks.${k}.align`, val)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" {...form.register(`sections.${nestIndex}.content.blocks.${k}.color`)} className="w-12 h-10 p-1" />
                                    <Input {...form.register(`sections.${nestIndex}.content.blocks.${k}.color`)} placeholder="#000000" className="font-mono uppercase" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Text Content</Label>
                            <TextToolbar textareaId={`content-text-${nestIndex}-${k}`} form={form} fieldName={`sections.${nestIndex}.content.blocks.${k}.text`} />
                            <Textarea id={`content-text-${nestIndex}-${k}`} {...form.register(`sections.${nestIndex}.content.blocks.${k}.text`)} rows={4} placeholder="Write your content here..." />
                        </div>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ type: 'p', text: "", color: "#333333", align: "left" })}><Plus className="mr-2 h-4 w-4" /> Add Text Block</Button>
        </div>
    )
}

function DonationSectionForm({ nestIndex, form }: { nestIndex: number, form: any }) {
    const { fields, append, remove } = useFieldArray({ control: form.control, name: `sections.${nestIndex}.content.items` })
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((item, k) => (
                    <div key={item.id} className="border p-4 rounded-md space-y-3 relative bg-muted/20">
                        <div className="absolute top-2 right-2 z-10">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} className="text-destructive h-6 w-6 rounded-full bg-background border"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                        <div className="space-y-1">
                            <Label>Item Image</Label>
                            <ImageUpload
                                value={form.watch(`sections.${nestIndex}.content.items.${k}.image`)}
                                onChange={(url) => form.setValue(`sections.${nestIndex}.content.items.${k}.image`, url)}
                                className="h-32"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Title</Label>
                            <Input {...form.register(`sections.${nestIndex}.content.items.${k}.title`)} placeholder="Package Title" />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <TextToolbar textareaId={`donation-desc-${nestIndex}-${k}`} form={form} fieldName={`sections.${nestIndex}.content.items.${k}.description`} />
                            <Textarea id={`donation-desc-${nestIndex}-${k}`} {...form.register(`sections.${nestIndex}.content.items.${k}.description`)} rows={2} />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <Label>Amount (₹)</Label>
                                <Input {...form.register(`sections.${nestIndex}.content.items.${k}.amount`)} type="number" placeholder="e.g. 5001" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <Label>URL Link</Label>
                                <Input {...form.register(`sections.${nestIndex}.content.items.${k}.itemQty`)} placeholder="Link URL" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <ImportTourDialog onImport={(items) => append(items)} />
                <Button type="button" variant="outline" size="sm" onClick={() => append({ image: "", title: "", description: "", itemQty: "", amount: "" })}><Plus className="mr-2 h-4 w-4" /> Add Donation Item</Button>
            </div>
        </div>
    )
}

function CustomDonationSectionForm({ nestIndex, form }: { nestIndex: number, form: any }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input {...form.register(`sections.${nestIndex}.content.title`)} placeholder="Donate Amount Of Your Choice" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Details */}
                <div className="space-y-3 p-3 border rounded-md">
                    <h4 className="font-semibold text-sm text-muted-foreground">Bank Details</h4>
                    <div className="space-y-1">
                        <Label className="text-xs">Bank Name</Label>
                        <Input {...form.register(`sections.${nestIndex}.content.bankDetails.bankName`)} className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Account Name</Label>
                        <Input {...form.register(`sections.${nestIndex}.content.bankDetails.accountName`)} className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Account Number</Label>
                        <Input {...form.register(`sections.${nestIndex}.content.bankDetails.accountNumber`)} className="h-8" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">IFSC Code</Label>
                        <Input {...form.register(`sections.${nestIndex}.content.bankDetails.ifscCode`)} className="h-8" />
                    </div>
                </div>
                {/* UPI Details */}
                <div className="space-y-3 p-3 border rounded-md">
                    <h4 className="font-semibold text-sm text-muted-foreground">UPI / QR</h4>
                    <div className="space-y-1">
                        <Label className="text-xs">QR Code Image</Label>
                        <ImageUpload
                            value={form.watch(`sections.${nestIndex}.content.upiDetails.qrImage`)}
                            onChange={(url) => form.setValue(`sections.${nestIndex}.content.upiDetails.qrImage`, url)}
                            className="h-32 w-32 mx-auto"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">UPI ID</Label>
                        <Input {...form.register(`sections.${nestIndex}.content.upiDetails.upiId`)} className="h-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}
