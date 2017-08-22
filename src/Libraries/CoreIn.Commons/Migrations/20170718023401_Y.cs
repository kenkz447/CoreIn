using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class Y : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplateDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplateTaxonomy");

            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplate");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Project",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Page",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Collection",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Album",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AddUniqueConstraint(
                name: "AK_CoreIn_Project_Name",
                table: "CoreIn_Project",
                column: "Name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_CoreIn_Page_Name",
                table: "CoreIn_Page",
                column: "Name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_CoreIn_Collection_Name",
                table: "CoreIn_Collection",
                column: "Name");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_CoreIn_Album_Name",
                table: "CoreIn_Album",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_CoreIn_Project_Name",
                table: "CoreIn_Project");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_CoreIn_Page_Name",
                table: "CoreIn_Page");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_CoreIn_Collection_Name",
                table: "CoreIn_Collection");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_CoreIn_Album_Name",
                table: "CoreIn_Album");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Project",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Page",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Collection",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoreIn_Album",
                nullable: false,
                oldClrType: typeof(string));

            migrationBuilder.CreateTable(
                name: "CoreIn_DesignTemplate",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: true),
                    EntityTypeId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    ParentId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_DesignTemplate", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplate_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplate_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_DesignTemplateDetail",
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
                    TempId = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_DesignTemplateDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplateDetail_CoreIn_DesignTemplate_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_DesignTemplate",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplateDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_DesignTemplateTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_DesignTemplateTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplateTaxonomy_CoreIn_DesignTemplate_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_DesignTemplate",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_DesignTemplateTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplate_EntityTypeId",
                table: "CoreIn_DesignTemplate",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplate_OwnerId",
                table: "CoreIn_DesignTemplate",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplateDetail_EntityId",
                table: "CoreIn_DesignTemplateDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplateDetail_ModifiedById",
                table: "CoreIn_DesignTemplateDetail",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplateTaxonomy_EntityId",
                table: "CoreIn_DesignTemplateTaxonomy",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_DesignTemplateTaxonomy_TaxonomyId",
                table: "CoreIn_DesignTemplateTaxonomy",
                column: "TaxonomyId");
        }
    }
}
