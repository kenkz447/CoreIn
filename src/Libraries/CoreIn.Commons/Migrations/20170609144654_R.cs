using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class R : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_ProjectTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_ProjectTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_ProjectTaxonomy_CoreIn_Project_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Project",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_ProjectTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_ProjectTaxonomy_EntityId",
                table: "CoreIn_ProjectTaxonomy",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_ProjectTaxonomy_TaxonomyId",
                table: "CoreIn_ProjectTaxonomy",
                column: "TaxonomyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_ProjectTaxonomy");
        }
    }
}
