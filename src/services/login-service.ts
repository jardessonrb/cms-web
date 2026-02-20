import { LoginDto, LoginForm } from "@/components/organisms/conteudoLogin";
import { api } from "./api";


export const LoginService = { 
    async login(body: LoginForm): Promise<LoginDto> {
        const response = await api.post<LoginDto>(`/auth/login`, body);
        return response.data;
    }, 
}