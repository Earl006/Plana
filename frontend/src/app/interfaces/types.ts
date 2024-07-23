export interface booking{
    id: string,
      userId: string
      eventId: string,
      quantity: number,
      totalPrice: number,
      status: string,
      verificationCode: string,
      verified: boolean,
      createdAt: string,
      updatedAt: string,
      event: {
        id: string,
        title: string,
        description:string,
        date: string,
        location: string,
        managerId: string,
        createdAt: string,
        updatedAt: string,
        categoryId: string,
        posterUrl:string,
      }
}