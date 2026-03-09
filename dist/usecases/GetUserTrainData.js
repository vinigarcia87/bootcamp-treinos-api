import { prisma } from "../lib/db.js";
export class GetUserTrainData {
    async execute(dto) {
        // Buscar o usuário com seus dados de treino
        const user = await prisma.user.findUnique({
            where: {
                id: dto.userId,
            },
            include: {
                trainData: true,
            },
        });
        if (!user || !user.trainData) {
            return null;
        }
        return {
            userId: user.id,
            userName: user.name,
            weightInGrams: user.trainData.weightInGrams,
            heightInCentimeters: user.trainData.heightInCentimeters,
            age: user.trainData.age,
            bodyFatPercentage: user.trainData.bodyFatPercentage * 100, // Converter para inteiro (0-100)
        };
    }
}
