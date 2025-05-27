# Development Guide

## Local Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-management-app.git
   cd project-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project/
├── app/                    # App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected routes
│   │   ├── projects/       # Project management
│   │   └── settings/       # User settings
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── auth/               # Auth components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── auth.ts             # Auth utilities
│   └── prisma.ts           # Prisma client
├── prisma/                 # Database schema
│   └── schema.prisma
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Code Style

- **JavaScript/TypeScript**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **React**: Follow [React Style Guide](https://reactjs.org/docs/faq-structure.html)
- **CSS**: Use [BEM](http://getbem.com/) methodology with Tailwind CSS

### Linting and Formatting

- ESLint for JavaScript/TypeScript linting
- Prettier for code formatting
- Stylelint for CSS/SCSS

Run the following commands:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check TypeScript types
npm run typecheck
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates

### Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Changes to the build process or auxiliary tools

**Example**:
```
feat(projects): add project creation form

- Add form validation
- Implement form submission
- Add success/error handling

Closes #123
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

### Writing Tests

- Use Jest as the test runner
- Use React Testing Library for component testing
- Place test files next to the code they test with `.test.tsx` or `.test.ts` extension

## Database Migrations

### Creating Migrations

```bash
npx prisma migrate dev --name <migration-name>
```

### Applying Migrations

```bash
npx prisma migrate deploy
```

## API Development

### Adding New Endpoints

1. Create a new file in `app/api/`
2. Export HTTP methods as named exports
3. Use `@/lib/auth` for authentication
4. Use Prisma for database operations
5. Add input validation using Zod

### Example API Endpoint

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = schema.parse(body);

    // Business logic here

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## Deployment

### Staging

- Automatically deploys from the `develop` branch
- Accessible at `staging.yourdomain.com`

### Production

- Manually deploy from the `main` branch
- Accessible at `yourdomain.com`

## Monitoring and Logging

- **Application Logs**: Check Vercel dashboard
- **Error Tracking**: Sentry integration
- **Performance**: Vercel Analytics

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Run `npx prisma generate`

2. **Authentication Issues**
   - Clear browser cookies
   - Check `NEXTAUTH_SECRET` in `.env.local`
   - Verify OAuth provider configuration

3. **Build Failures**
   - Run `npm install`
   - Clear `node_modules` and reinstall
   - Check for TypeScript errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
