using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class S : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_CollectionTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_CollectionTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_CollectionTaxonomy_CoreIn_Collection_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Collection",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_CollectionTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_CollectionTaxonomy_EntityId",
                table: "CoreIn_CollectionTaxonomy",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_CollectionTaxonomy_TaxonomyId",
                table: "CoreIn_CollectionTaxonomy",
                column: "TaxonomyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_CollectionTaxonomy");
        }
    }
}
