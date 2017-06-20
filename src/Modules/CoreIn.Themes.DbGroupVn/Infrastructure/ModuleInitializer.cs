using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using CoreIn.Modular.Infrastructure;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Identity;
using CoreIn.EntityCore;
using CoreIn.Themes.DbGroupVn.Resources;
using CoreIn.Models;

namespace CoreIn.Themes.DbGroupVn
{
    public class ModularInitializer : IModuleInitializer
    {
        private void InitDatabase(UserManager<User> userManager, IMenuHelper menuHelper, EntityTypeManager entityTypeManager)
        {
            var supperUser = userManager.FindByNameAsync(CoreIn.Resources.ConstantKeys.AppKey.SupperAdminUserName).Result;

            var menuItems = new Menu[]
            {
                menuHelper.CreateMenuEntity( new Menu { Name = "trang-chu" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Home", Language="en-US"},
                        new MenuDetail { Field = "title", Value = "Trang Chủ", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/"},
                        new MenuDetail { Field = "Order", Value = "1"},
                        new MenuDetail { Field = "Footer", Value = "3"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "ve-chung-toi" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "About", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/about", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Về chúng tôi", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/ve-chung-toi", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "2"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "cong-trinh" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Construction", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/construction", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Công trình", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/cong-trinh", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "3"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "du-an" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Project", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/project", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Dự án", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/du-an/tat-ca/1", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "4"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "bo-suu-tap" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Collection", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/collection", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Bộ sưu tập", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/bo-suu-tap", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "5"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "thu-vien" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Media", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/media", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Thư viện", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/thu-vien", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "6"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "phuong-phap" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Resource", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/resource", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Phương pháp", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/phuong-phap", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "7"},
                        new MenuDetail { Field = "Footer", Value = "1"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "hoi-dap" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "FAQ", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/faq", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Hỏi đáp", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/hoi-dap", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "8"},
                        new MenuDetail { Field = "Footer", Value = "2"},
                    },
                supperUser, false
                ),

                menuHelper.CreateMenuEntity( new Menu { Name = "lien-he" },
                    new MenuDetail[] {
                        new MenuDetail { Field = "title", Value = "Contact", Language="en-US"},
                        //new MenuDetail { Field = "url", Value = "/contact", Language="en-US"},

                        new MenuDetail { Field = "title", Value = "Liên hệ", Language="vi-VN"},
                        new MenuDetail { Field = "url", Value = "/lien-he", Language="vi-VN"},
                        new MenuDetail { Field = "Order", Value = "9"},
                    },
                supperUser, false
                ),
            };
            menuHelper.CreateMenuEntity(
                new Menu { Name = Keys.PrimaryMenu, Children = menuItems },
                null, supperUser
                );
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();

            var userManager = serviceProvider.GetService<UserManager<User>>();
            var menuHelper = serviceProvider.GetService<IMenuHelper>();
            var entityTypeManager = services.BuildServiceProvider().GetService<EntityTypeManager>();

            InitDatabase(userManager, menuHelper, entityTypeManager);
        }
    }
}
