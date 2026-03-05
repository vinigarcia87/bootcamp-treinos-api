import { prisma } from "../lib/db.js";

interface InputDto {
  userId: string;
}

interface OutputDto {
  userId: string;
  userName: string;
  weightInGrams: number;
  heightInCentimeters: number;
  age: number;
  bodyFatPercentage: number; // 100 representa 100%
}

export class GetUserTrainData {
  async execute(dto: InputDto): Promise<OutputDto | null> {
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
