using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class I : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_FileEntityInTaxonomy");

            migrationBuilder.CreateTable(
                name: "CoreIn_FileEntityTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false),
                    TaxonomyTypeId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_FileEntityTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityTaxonomy_CoreIn_FileEntity_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_FileEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_FileEntityTaxonomy_CoreIn_TaxonomyType_TaxonomyTypeId",
                        column: x => x.TaxonomyTypeId,
                        principalTable: "CoreIn_TaxonomyType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityTaxonomy_EntityId",
                table: "CoreIn_FileEntityTaxonomy",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityTaxonomy_TaxonomyId",
                table: "CoreIn_FileEntityTaxonomy",
                column: "TaxonomyId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityTaxonomy_TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy",
                column: "TaxonomyTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_FileEntityTaxonomy");

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

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityInTaxonomy_FileEntityId",
                table: "CoreIn_FileEntityInTaxonomy",
                column: "FileEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityInTaxonomy_TaxonomyId",
                table: "CoreIn_FileEntityInTaxonomy",
                column: "TaxonomyId");
        }
    }
}
