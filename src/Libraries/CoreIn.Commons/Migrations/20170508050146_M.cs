using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class M : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_Post",
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
                    table.PrimaryKey("PK_CoreIn_Post", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_Post_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_Post_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_PostDetail",
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
                    table.PrimaryKey("PK_CoreIn_PostDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostDetail_CoreIn_Post_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Post",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_PostTaxonomy",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    EntityId = table.Column<long>(nullable: false),
                    TaxonomyId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreIn_PostTaxonomy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostTaxonomy_CoreIn_Post_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_Post",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_PostTaxonomy_CoreIn_Taxonomy_TaxonomyId",
                        column: x => x.TaxonomyId,
                        principalTable: "CoreIn_Taxonomy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Post_EntityTypeId",
                table: "CoreIn_Post",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_Post_OwnerId",
                table: "CoreIn_Post",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostDetail_EntityId",
                table: "CoreIn_PostDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostDetail_ModifiedById",
                table: "CoreIn_PostDetail",
                column: "ModifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostTaxonomy_EntityId",
                table: "CoreIn_PostTaxonomy",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_PostTaxonomy_TaxonomyId",
                table: "CoreIn_PostTaxonomy",
                column: "TaxonomyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_PostDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_PostTaxonomy");

            migrationBuilder.DropTable(
                name: "CoreIn_Post");
        }
    }
}
