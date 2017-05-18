using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class P : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Project",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Post",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_OptionGroup",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Construction",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Collection",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_TaxonomyType",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Taxonomy",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_Menu",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_FileEntity",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CoreIn_EntityType",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CoreIn_Album",
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
                    table.PrimaryKey("PK_CoreIn_Album", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_Album_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Album_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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
                name: "CoreIn_Page",
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
                    table.PrimaryKey("PK_CoreIn_Page", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_Page_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Page_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_AlbumDetail",
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
                    table.PrimaryKey("PK_CoreIn_AlbumDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_AlbumDetail_CoreIn_Album_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Album",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_AlbumDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
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

            migrationBuilder.CreateTable(
                name: "CoreIn_PageDetail",
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
                    table.PrimaryKey("PK_CoreIn_PageDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_PageDetail_CoreIn_Page_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Page",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_PageDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Album_EntityTypeId",
                table: "CoreIn_Album",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Album_OwnerId",
                table: "CoreIn_Album",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_AlbumDetail_EntityId",
                table: "CoreIn_AlbumDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_AlbumDetail_ModifiedById",
                table: "CoreIn_AlbumDetail",
                column: "ModifiedById");

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

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Page_EntityTypeId",
                table: "CoreIn_Page",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Page_OwnerId",
                table: "CoreIn_Page",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PageDetail_EntityId",
                table: "CoreIn_PageDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PageDetail_ModifiedById",
                table: "CoreIn_PageDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_AlbumDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplateDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplateTaxonomy");

            migrationBuilder.DropTable(
                name: "CoreIn_PageDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_Album");

            migrationBuilder.DropTable(
                name: "CoreIn_DesignTemplate");

            migrationBuilder.DropTable(
                name: "CoreIn_Page");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Project");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Post");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_OptionGroup");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Construction");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Collection");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_TaxonomyType");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Taxonomy");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_Menu");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_FileEntity");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "CoreIn_EntityType");
        }
    }
}
