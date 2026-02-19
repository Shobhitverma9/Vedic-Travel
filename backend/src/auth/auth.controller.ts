import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOTPDto } from './dto/send-otp.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { SendLoginOTPDto } from './dto/send-login-otp.dto';
import { LoginWithOTPDto } from './dto/login-otp.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user with email (traditional)' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP for registration (new flow)' })
    async sendOTP(@Body() sendOTPDto: SendOTPDto) {
        return this.authService.sendRegistrationOTP(sendOTPDto);
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP and create account' })
    async verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
        return this.authService.verifyAndRegister(verifyOTPDto);
    }

    @Post('resend-otp')
    @ApiOperation({ summary: 'Resend OTP code' })
    async resendOTP(@Body() resendOTPDto: ResendOTPDto) {
        return this.authService.resendOTP(resendOTPDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('send-login-otp')
    @ApiOperation({ summary: 'Send OTP for login' })
    async sendLoginOTP(@Body() sendLoginOTPDto: SendLoginOTPDto) {
        return this.authService.sendLoginOTP(sendLoginOTPDto);
    }

    @Post('login-with-otp')
    @ApiOperation({ summary: 'Login with OTP code' })
    async loginWithOTP(@Body() loginWithOTPDto: LoginWithOTPDto) {
        return this.authService.loginWithOTP(loginWithOTPDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Initiate Google OAuth login' })
    async googleAuth() {
        // Initiates Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const { user, token } = await this.authService.googleLogin(req.user);

        // Redirect to frontend with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Req() req) {
        return req.user;
    }
}
