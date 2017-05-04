using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class K : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "CoreIn_TaxonomyTypeDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "CoreIn_TaxonomyDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "CoreIn_MenuDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "CoreIn_FileEntityDetail",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "CoreIn_EntityTypeDetail",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CoreIn_Project",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: true),
                    EntityTypeId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    OwnerId = table.Column<long>(nullable: true),
                    ParentId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_Project", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_Project_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Project_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_ProjectDetail",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    Field = table.Column<string>(nullable: true),
                    Group = table.Column<string>(nullable: true),
                    Language = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: true),
                    ModifiedById = table.Column<long>(nullable: true),
                    Prefix = table.Column<string>(nullable: true),
                    Suffix = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_ProjectDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_ProjectDetail_CoreIn_Project_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Project",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_ProjectDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Project_EntityTypeId",
                table: "CoreIn_Project",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Project_OwnerId",
                table: "CoreIn_Project",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_ProjectDetail_EntityId",
                table: "CoreIn_ProjectDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_ProjectDetail_ModifiedById",
                table: "CoreIn_ProjectDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_ProjectDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_Project");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "CoreIn_MenuDetail");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "CoreIn_FileEntityDetail");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "CoreIn_EntityTypeDetail");
        }
    }
}
