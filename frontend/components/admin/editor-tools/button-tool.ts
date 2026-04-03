
export default class ButtonTool {
    data: { text: string; url: string; variant?: string };
    wrapper: HTMLElement | undefined;

    static get toolbox() {
        return {
            title: 'Button',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>'
        };
    }

    constructor({ data }: { data: any }) {
        this.data = {
            text: data.text || '',
            url: data.url || '',
            variant: data.variant || 'default'
        };
        this.wrapper = undefined;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('p-4', 'border', 'rounded-lg', 'bg-muted/30', 'flex', 'gap-4', 'items-center');

        const textInput = document.createElement('input');
        textInput.placeholder = 'Button Text';
        textInput.value = this.data.text;
        textInput.classList.add('flex-1', 'px-3', 'py-2', 'border', 'rounded', 'text-sm');
        textInput.addEventListener('input', (e) => {
            this.data.text = (e.target as HTMLInputElement).value;
        });

        const urlInput = document.createElement('input');
        urlInput.placeholder = 'Button URL (https://...)';
        urlInput.value = this.data.url;
        urlInput.classList.add('flex-1', 'px-3', 'py-2', 'border', 'rounded', 'text-sm');
        urlInput.addEventListener('input', (e) => {
            this.data.url = (e.target as HTMLInputElement).value;
        });

        // Preview button
        const previewBtn = document.createElement('button');
        previewBtn.innerText = 'Preview';
        previewBtn.className = 'px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium';

        this.wrapper.appendChild(textInput);
        this.wrapper.appendChild(urlInput);
        this.wrapper.appendChild(previewBtn);

        return this.wrapper;
    }

    save(blockContent: HTMLElement) {
        return {
            text: this.data.text,
            url: this.data.url,
            variant: this.data.variant
        };
    }
}
