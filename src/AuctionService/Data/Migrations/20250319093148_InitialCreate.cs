using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuctionService.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Auctions",
                columns: table => new
                {
                    ID = table.Column<string>(type: "text", nullable: false),
                    productID = table.Column<string>(type: "text", nullable: true),
                    sellerID = table.Column<string>(type: "text", nullable: true),
                    startPrice = table.Column<int>(type: "integer", nullable: false),
                    currentPrice = table.Column<int>(type: "integer", nullable: false),
                    bidStep = table.Column<int>(type: "integer", nullable: false),
                    startTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    endTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    winnerID = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Auctions", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Bids",
                columns: table => new
                {
                    ID = table.Column<string>(type: "text", nullable: false),
                    userID = table.Column<string>(type: "text", nullable: true),
                    bidAmount = table.Column<int>(type: "integer", nullable: false),
                    bidTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    auctionID = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bids", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Bids_Auctions_auctionID",
                        column: x => x.auctionID,
                        principalTable: "Auctions",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bids_auctionID",
                table: "Bids",
                column: "auctionID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bids");

            migrationBuilder.DropTable(
                name: "Auctions");
        }
    }
}
