import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage = () => {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">관리자 대시보드</h1>
				<p className="text-gray-600 mt-2">DPM 코어 시스템 관리</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>사용자 관리</CardTitle>
						<CardDescription>사용자 계정 및 권한 관리</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,234</div>
						<p className="text-sm text-gray-600">총 사용자 수</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>세션 관리</CardTitle>
						<CardDescription>진행 중인 세션 모니터링</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">56</div>
						<p className="text-sm text-gray-600">활성 세션</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>시스템 상태</CardTitle>
						<CardDescription>시스템 상태 및 성능 모니터링</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">정상</div>
						<p className="text-sm text-gray-600">시스템 상태</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminPage;
