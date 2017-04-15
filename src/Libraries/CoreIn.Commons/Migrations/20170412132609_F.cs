using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class F : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_TaxonomyType",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: true),
                    EntityTypeId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    ParentId = table.Column<long>(nullable: true),
                    TaxonomyTypeId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_TaxonomyType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyType_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyType_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyType_CoreIn_TaxonomyType_TaxonomyTypeId",
                        column: x => x.TaxonomyTypeId,
                        principalTable: "CoreIn_TaxonomyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_Taxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Created = table.Column<DateTime>(nullable: true),
                    EntityTypeId = table.Column<long>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    OwnerId = table.Column<long>(nullable: true),
                    ParentId = table.Column<long>(nullable: true),
                    TaxonomyId = table.Column<long>(nullable: true),
                    TaxonomyTypeId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_Taxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_Taxonomy_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Taxonomy_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Taxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Taxonomy_CoreIn_TaxonomyType_TaxonomyTypeId",
                        column: x => x.TaxonomyTypeId,
                        principalTable: "CoreIn_TaxonomyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_TaxonomyTypeDetail",
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
                    table.PrimaryKey("PK_CoreIn_TaxonomyTypeDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyTypeDetail_CoreIn_TaxonomyType_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_TaxonomyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyTypeDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_FileEntityInTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FileEntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_FileEntityInTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityInTaxonomy_CoreIn_FileEntity_FileEntityId",
                        column: x => x.FileEntityId,
                        principalTable: "CoreIn_FileEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityInTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_TaxonomyDetail",
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
                    table.PrimaryKey("PK_CoreIn_TaxonomyDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyDetail_CoreIn_Taxonomy_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_TaxonomyDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityInTaxonomy_FileEntityId",
                table: "CoreIn_FileEntityInTaxonomy",
                column: "FileEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityInTaxonomy_TaxonomyId",
                table: "CoreIn_FileEntityInTaxonomy",
                column: "TaxonomyId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_EntityTypeId",
                table: "CoreIn_Taxonomy",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_OwnerId",
                table: "CoreIn_Taxonomy",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_TaxonomyId",
                table: "CoreIn_Taxonomy",
                column: "TaxonomyId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_TaxonomyTypeId",
                table: "CoreIn_Taxonomy",
                column: "TaxonomyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyDetail_EntityId",
                table: "CoreIn_TaxonomyDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyDetail_ModifiedById",
                table: "CoreIn_TaxonomyDetail",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyType_EntityTypeId",
                table: "CoreIn_TaxonomyType",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyType_OwnerId",
                table: "CoreIn_TaxonomyType",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyType_TaxonomyTypeId",
                table: "CoreIn_TaxonomyType",
                column: "TaxonomyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyTypeDetail_EntityId",
                table: "CoreIn_TaxonomyTypeDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_TaxonomyTypeDetail_ModifiedById",
                table: "CoreIn_TaxonomyTypeDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_FileEntityInTaxonomy");

            migrationBuilder.DropTable(
                name: "CoreIn_TaxonomyDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_TaxonomyTypeDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_Taxonomy");

            migrationBuilder.DropTable(
                name: "CoreIn_TaxonomyType");
        }
    }
}
