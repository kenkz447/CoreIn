using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CoreIn.Commons.Migrations
{
    public partial class J : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoreIn_FileEntityTaxonomy_CoreIn_TaxonomyType_TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy");

            migrationBuilder.DropIndex(
                name: "IX_CoreIn_FileEntityTaxonomy_TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy");

            migrationBuilder.DropColumn(
                name: "TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_FileEntityTaxonomy_TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy",
                column: "TaxonomyTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoreIn_FileEntityTaxonomy_CoreIn_TaxonomyType_TaxonomyTypeId",
                table: "CoreIn_FileEntityTaxonomy",
                column: "TaxonomyTypeId",
                principalTable: "CoreIn_TaxonomyType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
