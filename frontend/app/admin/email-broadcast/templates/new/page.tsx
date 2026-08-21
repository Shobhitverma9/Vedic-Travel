import { EmailTemplateForm } from "@/components/admin/email-template-form"
export const dynamic = 'force-dynamic';

export default function NewTemplatePage() {
    return (
        <div className="p-4 md:p-8">
            <EmailTemplateForm />
        </div>
    )
}
