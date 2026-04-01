import { useQuery } from '@tanstack/react-query';
import { yatrasService } from '@/services/yatras.service';

export function useYatras(params?: any) {
    return useQuery({
        queryKey: ['yatras', params],
        queryFn: () => yatrasService.getAllYatras(params),
    });
}

export function useYatra(idOrSlug: string, isSlug = false) {
    return useQuery({
        queryKey: ['yatra', idOrSlug],
        queryFn: () => isSlug ? yatrasService.getYatraBySlug(idOrSlug) : yatrasService.getYatraById(idOrSlug),
    });
}
