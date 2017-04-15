using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class G : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_Taxonomy_CoreIn_Taxonomy_TaxonomyId",
                table: "CoreIn_Taxonomy");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_Taxonomy_TaxonomyId",
                table: "CoreIn_Taxonomy");

            migrationBuilder.DropColumn(
                name: "TaxonomyId",
                table: "CoreIn_Taxonomy");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_ParentId",
                table: "CoreIn_Taxonomy",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_Taxonomy_CoreIn_Taxonomy_ParentId",
                table: "CoreIn_Taxonomy",
                column: "ParentId",
                principalTable: "CoreIn_Taxonomy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_Taxonomy_CoreIn_Taxonomy_ParentId",
                table: "CoreIn_Taxonomy");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_Taxonomy_ParentId",
                table: "CoreIn_Taxonomy");

            migrationBuilder.AddColumn<long>(
                name: "TaxonomyId",
                table: "CoreIn_Taxonomy",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Taxonomy_TaxonomyId",
                table: "CoreIn_Taxonomy",
                column: "TaxonomyId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_Taxonomy_CoreIn_Taxonomy_TaxonomyId",
                table: "CoreIn_Taxonomy",
                column: "TaxonomyId",
                principalTable: "CoreIn_Taxonomy",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
