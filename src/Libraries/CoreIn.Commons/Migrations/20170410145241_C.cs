using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class C : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "EntityTypeId",
                table: "CoreIn_Menu",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "EntityTypeId",
                table: "CoreIn_FileEntity",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CoreIn_EntityType",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_EntityType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Menu_EntityTypeId",
                table: "CoreIn_Menu",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntity_EntityTypeId",
                table: "CoreIn_FileEntity",
                column: "EntityTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_FileEntity_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntity",
                column: "EntityTypeId",
                principalTable: "CoreIn_EntityType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_Menu",
                column: "EntityTypeId",
                principalTable: "CoreIn_EntityType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_FileEntity_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_FileEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_Menu_CoreIn_EntityType_EntityTypeId",
                table: "CoreIn_Menu");

            migrationBuilder.DropTable(
                name: "CoreIn_EntityType");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_Menu_EntityTypeId",
                table: "CoreIn_Menu");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_FileEntity_EntityTypeId",
                table: "CoreIn_FileEntity");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "CoreIn_Menu");

            migrationBuilder.DropColumn(
                name: "EntityTypeId",
                table: "CoreIn_FileEntity");
        }
    }
}
