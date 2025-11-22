import MobileMenu from '@/app/(app)/settings/components/mobile-menu';
export const Divider = () => <div className='block my-0.5 border-b w-full' />

export const Title = ({
    title,
    description
}: {
    title: string,
    description: string
}) => {
    return (
        <div className='mb-4 w-full'>
            <div className='flex justify-between items-center gap-2 w-full'>
                <h1 className='font-medium text-xl'>{title}</h1>
                <MobileMenu />
            </div>
            <Divider />
            <span className='block dark:text-muted-foreground text-sm'>
                {description}
            </span>
        </div>
    )
}
export const Section = ({
    heading,
    description,
    children
}: {
    heading: string,
    description: string,
    children: React.ReactNode
}) => {
    return (
        <div className='mb-8'>
            <span className='block font-medium text-primary'>
                {heading}
            </span>
            <Divider />
            <span className='block dark:text-muted-foreground text-sm'>
                {description}
            </span>
            <div className='mt-4'>
                {children}
            </div>
        </div>
    )
}