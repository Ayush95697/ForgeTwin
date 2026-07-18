using ForgeTwin.Data;
using ForgeTwin.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ForgeUser = ForgeTwin.Models.User;

namespace ForgeTwin.Controllers;

[Authorize]
public class UsersController : Controller
{
    private readonly ForgeTwinDbContext _context;
    private readonly IPasswordHasher<ForgeUser> _passwordHasher;

    public UsersController(ForgeTwinDbContext context, IPasswordHasher<ForgeUser> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<IActionResult> Index() => View(await _context.Users.OrderBy(user => user.Username).ToListAsync());

    public IActionResult Create() => View();

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Username,PasswordHash,Role")] ForgeUser user)
    {
        ModelState.Remove(nameof(ForgeUser.WorkOrders));
        if (ModelState.IsValid)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
            _context.Add(user);
            try
            {
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            catch (DbUpdateException)
            {
                ModelState.AddModelError(nameof(ForgeUser.Username), "That username already exists.");
            }
        }
        return View(user);
    }
}
