import authService from '../services/authService.js';

class AuthController {
    
    async login(req, res) {
        try {
            const { teamName, password } = req.body;
            
            if (!teamName || !password) {
                return res.status(400).json({ success: false, error: "Missing name or password." });
            }

            const result = await authService.login(teamName, password);
            
            // For a mock auction, we'll return the teamId as a "token" in the response body
            // We can also set a cookie or JWT if required later, but this is simple for classroom pods
            res.json({
                success: true,
                data: {
                    ...result,
                    token: result.teamId // Simple token for student pods
                }
            });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async adminLogin(req, res) {
        try {
            const { password } = req.body;
            const result = await authService.adminLogin(password);
            res.json({
                success: true,
                data: { ...result, token: 'ADMIN_MASTER_TOKEN' }
            });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async screenLogin(req, res) {
        try {
            const { password } = req.body;
            const result = await authService.screenLogin(password);
            res.json({
                success: true,
                data: { ...result, token: 'SCREEN_DISPLAY_TOKEN' }
            });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }
}

export default new AuthController();
