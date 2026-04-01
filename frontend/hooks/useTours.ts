import { useQuery } from '@tanstack/react-query';
import { toursService } from '@/services/tours.service';

export function useTours(params?: any) {
    return useQuery({
        queryKey: ['tours', params],
        queryFn: () => toursService.getAllTours(params),
    });
}

export function useTour(idOrSlug: string, isSlug = false) {
    return useQuery({
        queryKey: ['tour', idOrSlug],
        queryFn: () => isSlug ? toursService.getTourBySlug(idOrSlug) : toursService.getTourById(idOrSlug),
    });
}
