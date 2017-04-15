using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class E : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_FileEntityDetail_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_FileEntityDetail_EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.CreateTable(
                name: "CoreIn_EntityTypeDetail",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    Field = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: true),
                    ModifiedById = table.Column<long>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_EntityTypeDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_EntityTypeDetail_CoreIn_EntityType_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_EntityTypeDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_EntityTypeDetail_EntityId",
                table: "CoreIn_EntityTypeDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_EntityTypeDetail_ModifiedById",
                table: "CoreIn_EntityTypeDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_EntityTypeDetail");

            migrationBuilder.AddColumn<long>(
                name: "EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityDetail_EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                column: "EntityTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_FileEntityDetail_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntityDetail",
                column: "EntityTypeId",
                principalTable: "CoreIn_EntityType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
