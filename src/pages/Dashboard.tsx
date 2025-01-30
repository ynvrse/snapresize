import { PageHeader, PageHeaderHeading } from '@/components/page-header';

import LoadingScreen from '@/components/LoadingScreen';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import useAppConfig from '@/hooks/useStellaryst';

export default function Dashboard() {
    const { loading } = useAppConfig();
    if (loading) return <LoadingScreen loading={loading} />;
    return (
        <>
            <PageHeader>
                <PageHeaderHeading className="flex w-full justify-between">Dashboard</PageHeaderHeading>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle className="leading-relaxed">
                        Stellaryst - Mobile-First PWA Development Starter Kit
                    </CardTitle>
                    <CardDescription className="text-base">
                        Stellaryst is a modern starter kit specifically designed building and deploying mobile-first
                        Progressive Web Applications (PWA). It combines React + typescript + shadcn/ui + tailwind css v4
                        + vitePWA + github pages.
                    </CardDescription>
                </CardHeader>
            </Card>
        </>
    );
}
