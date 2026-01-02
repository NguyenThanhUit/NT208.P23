FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /app
EXPOSE 80

#Copy file .csproj
COPY NT208.P23.sln NT208.P23.sln
COPY src/OrderService/OrderService.csproj src/OrderService/OrderService.csproj
COPY src/SearchService/SearchService.csproj src/SearchService/SearchService.csproj
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj 
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj
COPY src/IdentityService/IdentityService.csproj src/IdentityService/IdentityService.csproj
COPY src/BuyingService/BuyingService.csproj src/BuyingService/BuyingService.csproj
COPY src/WalletService/WalletService.csproj src/WalletService/WalletService.csproj
COPY src/AuctionService/AuctionService.csproj src/AuctionService/AuctionService.csproj
COPY src/NotificationService/NotificationService.csproj src/NotificationService/NotificationService.csproj
COPY src/UserService/UserService.csproj src/UserService/UserService.csproj
# Restore package deps
RUN dotnet restore NT208.P23.sln
# Copy the app folders 
COPY src/Contracts src/Contracts
WORKDIR /app/src/Contracts
RUN dotnet publish -c Release -o /app/src/out
# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT [ "dotnet", "Contracts.dll" ]


