import { EmailTemplateForm } from "@/components/admin/email-template-form"
export const dynamic = 'force-dynamic';

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    return (
        <div className="p-4 md:p-8">
            <EmailTemplateForm id={id} />
        </div>
    )
}
