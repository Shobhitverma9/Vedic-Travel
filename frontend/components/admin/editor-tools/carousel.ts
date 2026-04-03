import { API, BlockTool, BlockToolConstructorOptions, BlockToolData } from '@editorjs/editorjs';

interface CarouselData extends BlockToolData {
    files: {
        url: string;
        caption?: string;
    }[];
}

interface CarouselConfig {
    uploader?: {
        uploadByFile(file: File): Promise<{ success: number; file: { url: string } }>;
    };
}

export default class Carousel implements BlockTool {
    api: API;
    data: CarouselData;
    config: CarouselConfig;
    wrapper: HTMLElement | undefined;
    nodes: {
        wrapper: HTMLElement;
        container: HTMLElement;
        addButton: HTMLElement;
        fileInput: HTMLInputElement;
    };

    constructor({ data, api, config }: BlockToolConstructorOptions<CarouselData, CarouselConfig>) {
        this.api = api;
        this.data = {
            files: data.files || [],
        };
        this.config = config || {};
        this.nodes = {
            wrapper: document.createElement('div'),
            container: document.createElement('div'),
            addButton: document.createElement('div'),
            fileInput: document.createElement('input'),
        };
    }

    static get toolbox() {
        return {
            title: 'Carousel',
            icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L20 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 18L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        };
    }

    render() {
        this.nodes.wrapper.classList.add('cdx-block');
        this.nodes.container.classList.add('carousel-container', 'flex', 'flex-wrap', 'gap-4', 'mb-4');

        // Setup File Input
        this.nodes.fileInput.type = 'file';
        this.nodes.fileInput.multiple = true;
        this.nodes.fileInput.accept = 'image/*';
        this.nodes.fileInput.style.display = 'none';
        this.nodes.fileInput.addEventListener('change', (event) => {
            this.handleFileSelect(event);
        });

        // Setup Add Button
        this.nodes.addButton.classList.add('cdx-button', 'flex', 'items-center', 'justify-center', 'w-full', 'p-4', 'border', 'border-dashed', 'border-gray-300', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-50');
        this.nodes.addButton.innerHTML = 'Select Images';
        this.nodes.addButton.addEventListener('click', () => {
            this.nodes.fileInput.click();
        });

        this.renderImages();

        this.nodes.wrapper.appendChild(this.nodes.container);
        this.nodes.wrapper.appendChild(this.nodes.addButton);
        this.nodes.wrapper.appendChild(this.nodes.fileInput);

        return this.nodes.wrapper;
    }

    renderImages() {
        this.nodes.container.innerHTML = '';
        this.data.files.forEach((file, index) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item', 'relative', 'w-32', 'h-32', 'rounded-lg', 'overflow-hidden', 'group');

            const img = document.createElement('img');
            img.src = file.url;
            img.classList.add('w-full', 'h-full', 'object-cover');

            const removeBtn = document.createElement('div');
            removeBtn.classList.add('absolute', 'top-1', 'right-1', 'bg-red-500', 'text-white', 'p-1', 'rounded-full', 'cursor-pointer', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity');
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => {
                this.data.files.splice(index, 1);
                this.renderImages();
            });

            item.appendChild(img);
            item.appendChild(removeBtn);
            this.nodes.container.appendChild(item);
        });
    }

    async handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (!files || !files.length || !this.config.uploader) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const response = await this.config.uploader.uploadByFile(file);
                if (response.success && response.file && response.file.url) {
                    this.data.files.push({
                        url: response.file.url,
                    });
                }
            } catch (error) {
                console.error('Upload failed for file:', file.name, error);
            }
        }

        this.renderImages();
        input.value = ''; // Reset input
    }

    save() {
        return this.data;
    }
}
