using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CoreIn.Commons.Migrations
{
    public partial class N : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoreIn_OptionGroup",
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
                    table.PrimaryKey("PK_CoreIn_OptionGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_OptionGroup_CoreIn_EntityType_EntityTypeId",
                        column: x => x.EntityTypeId,
                        principalTable: "CoreIn_EntityType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CoreIn_OptionGroup_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CoreIn_OptionGroupDetail",
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
                    table.PrimaryKey("PK_CoreIn_OptionGroupDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CoreIn_OptionGroupDetail_CoreIn_OptionGroup_EntityId",
                        column: x => x.EntityId,
                        principalTable: "CoreIn_OptionGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CoreIn_OptionGroupDetail_AspNetUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_OptionGroup_EntityTypeId",
                table: "CoreIn_OptionGroup",
                column: "EntityTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_OptionGroup_OwnerId",
                table: "CoreIn_OptionGroup",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_OptionGroupDetail_EntityId",
                table: "CoreIn_OptionGroupDetail",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_CoreIn_OptionGroupDetail_ModifiedById",
                table: "CoreIn_OptionGroupDetail",
                column: "ModifiedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoreIn_OptionGroupDetail");

            migrationBuilder.DropTable(
                name: "CoreIn_OptionGroup");
        }
    }
}
