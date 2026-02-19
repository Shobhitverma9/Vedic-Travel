import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post('initiate')
    // @UseGuards(AuthGuard('jwt')) // Removed to allow guest checkout
    // @ApiBearerAuth()
    @ApiOperation({ summary: 'Initiate PayU payment for booking' })
    async initiatePayment(
        @Req() req,
        @Body() initiatePaymentDto: InitiatePaymentDto,
    ) {
        const userId = req.user ? req.user._id : undefined;
        return this.paymentsService.initiatePayment(
            initiatePaymentDto.bookingId,
            userId,
        );
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify PayU payment (webhook/callback)' })
    async verifyPayment(@Body() paymentData: any, @Res() res) {
        const result = await this.paymentsService.verifyPayment(paymentData);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        if (result.success) {
            return res.redirect(`${frontendUrl}/payment/success?bookings=${result.bookingId}`);
        } else {
            return res.redirect(`${frontendUrl}/payment/failure?bookings=${result.bookingId}`);
        }
    }

    @Post('webhook')
    @ApiOperation({ summary: 'PayU webhook handler' })
    async handleWebhook(@Body() webhookData: any) {
        // PayU webhook handling
        return this.paymentsService.verifyPayment(webhookData);
    }

    @Post('emi-options')
    @ApiOperation({ summary: 'Get EMI options for a given amount' })
    async getEmiOptions(@Body() body: { amount: number }) {
        return this.paymentsService.getEmiOptions(body.amount);
    }
}
